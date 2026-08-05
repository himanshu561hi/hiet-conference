const mongoose = require('mongoose');
const JoinRequest = require('../models/JoinRequest');
const Team = require('../models/Team');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const NotificationService = require('./NotificationService');

const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

exports.sendRequest = async (memberId, teamIdString, joinCode, req) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // 1. Validate User not in team
    const existingTeam = await Team.findOne({ 'members.user': memberId, isDeleted: false }).session(session);
    if (existingTeam) {
      const err = new Error('You are already part of an active team.');
      err.code = 'TM_002'; err.statusCode = 400; throw err;
    }

    // 2. Validate Team & Join Code
    const team = await Team.findOne({ teamId: teamIdString, isDeleted: false }).session(session);
    if (!team || team.joinCode !== joinCode) {
      const err = new Error('Invalid or expired Join Code.');
      err.code = 'TM_004'; err.statusCode = 400; throw err;
    }

    if (team.status === 'Submitted' || team.status === 'Locked') {
      const err = new Error('Action blocked. The team is locked.');
      err.code = 'TM_007'; err.statusCode = 403; throw err;
    }

    if (team.members.length >= 3 || team.teamType === 'Solo') {
      const err = new Error('Team capacity exceeded.');
      err.code = 'TM_003'; err.statusCode = 400; throw err;
    }

    // 3. Prevent Duplicates
    const duplicateRequest = await JoinRequest.findOne({
      team: team._id,
      member: memberId,
      status: 'Pending',
      expiresAt: { $gt: new Date() }
    }).session(session);

    if (duplicateRequest) {
      const err = new Error('Too many join requests. Try again later.');
      err.code = 'TM_015'; err.statusCode = 429; throw err;
    }

    // 4. Create Request
    const joinRequest = new JoinRequest({
      team: team._id,
      member: memberId,
      status: 'Pending'
    });
    await joinRequest.save({ session });

    // 5. Notify Leader
    const leader = await User.findById(team.leader).session(session);
    await NotificationService.send({
      userId: leader._id,
      email: leader.email,
      title: 'NEXUS 2026 - New Join Request',
      message: `${req.user.fullName} (${req.user.userId}) has requested to join your team.`,
      type: 'REQUEST_RECEIVED',
      session
    });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return joinRequest;

  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.getTeamRequests = async (leaderId) => {
  const team = await Team.findOne({ leader: leaderId, isDeleted: false });
  if (!team) return [];
  
  return JoinRequest.find({ team: team._id, status: 'Pending' })
    .populate('member', 'fullName email userId')
    .sort({ createdAt: -1 });
};

exports.getUserRequests = async (memberId) => {
  return JoinRequest.find({ member: memberId, status: { $in: ['Pending', 'Accepted', 'Rejected'] } })
    .populate('team', 'teamName teamId')
    .sort({ createdAt: -1 });
};

exports.acceptRequest = async (leaderId, requestId, req) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }
  try {
    const joinRequest = await JoinRequest.findById(requestId).populate('member').session(session);
    if (!joinRequest) { const err = new Error('Request not found'); err.statusCode = 404; throw err; }
    if (joinRequest.status !== 'Pending') { const err = new Error('Request already processed'); err.statusCode = 400; throw err; }

    const team = await Team.findById(joinRequest.team).session(session);
    if (team.leader.toString() !== leaderId.toString()) {
      const err = new Error('Only the Team Leader can accept requests'); err.statusCode = 403; throw err;
    }
    if (team.members.length >= 3 || team.teamType === 'Solo') {
      const err = new Error('Team is full'); err.statusCode = 400; throw err;
    }

    joinRequest.status = 'Accepted';
    await joinRequest.save({ session });

    team.members.push({ user: joinRequest.member._id, joinedAt: new Date() });
    await team.save({ session });

    await new AuditLog({ user: leaderId, userId: req.user.userId, action: 'REQUEST_ACCEPTED', targetId: joinRequest.member._id.toString(), ip: req.ip, device: req.headers['user-agent'] }).save({ session });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return joinRequest;
  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.rejectRequest = async (leaderId, requestId, req) => {
  const joinRequest = await JoinRequest.findById(requestId);
  if (!joinRequest) { const err = new Error('Request not found'); err.statusCode = 404; throw err; }
  
  const team = await Team.findById(joinRequest.team);
  if (team.leader.toString() !== leaderId.toString()) { const err = new Error('Unauthorized'); err.statusCode = 403; throw err; }

  joinRequest.status = 'Rejected';
  await joinRequest.save();
  return joinRequest;
};

exports.cancelRequest = async (userId, requestId, req) => {
  const joinRequest = await JoinRequest.findById(requestId);
  if (!joinRequest || joinRequest.member.toString() !== userId.toString()) {
    const err = new Error('Request not found or unauthorized'); err.statusCode = 404; throw err;
  }
  joinRequest.status = 'Cancelled';
  await joinRequest.save();
  return joinRequest;
};
