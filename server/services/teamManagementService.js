const mongoose = require('mongoose');
const Team = require('../models/Team');
const AuditLog = require('../models/AuditLog');
const NotificationService = require('./NotificationService');
const User = require('../models/User');

const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

/** Helper to validate Team Locks */
const validateLock = (team) => {
  const lockedStatuses = ['Submitted', 'Approved', 'Rejected', 'Locked', 'Needs Correction'];
  if (lockedStatuses.includes(team.status) || team.isDeleted) {
    const err = new Error('Action blocked. The team roster is locked during this phase.');
    err.code = 'TM_007'; err.statusCode = 403; throw err;
  }
};

exports.removeMember = async (teamId, targetMemberId, leaderId, req) => {
  let session = null;
  if (checkIsReplicaSet()) { session = await mongoose.startSession(); session.startTransaction(); }

  try {
    const team = await Team.findOne({ _id: teamId, isDeleted: false }).session(session);
    if (!team) {
      const err = new Error('Team not found'); err.code = 'TM_008'; err.statusCode = 404; throw err;
    }

    if (team.leader.toString() !== leaderId.toString()) {
      const err = new Error('Only the Leader can perform this action.'); err.code = 'TM_006'; err.statusCode = 403; throw err;
    }

    if (leaderId.toString() === targetMemberId.toString()) {
      const err = new Error('Leader cannot remove themselves.'); err.code = 'TM_010'; err.statusCode = 400; throw err;
    }

    validateLock(team);

    const memberIndex = team.members.findIndex(m => m.user.toString() === targetMemberId.toString());
    if (memberIndex === -1) {
      const err = new Error('Member not found in team.'); err.code = 'TM_009'; err.statusCode = 404; throw err;
    }

    // Remove Member
    team.members.splice(memberIndex, 1);
    await team.save({ session });

    // Audit & Notify
    await new AuditLog({
      user: leaderId, userId: req.user.userId, action: 'MEMBER_REMOVED', targetId: teamId.toString(),
      ip: req.ip, device: req.headers['user-agent']
    }).save({ session });

    const targetUser = await User.findById(targetMemberId).session(session);
    await NotificationService.send({
      userId: targetMemberId,
      email: targetUser.email,
      title: 'NEXUS 2026 - Removed from Team',
      message: `You have been removed from the team ${team.teamName} by the leader.`,
      type: 'WARNING',
      session
    });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return team;
  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.leaveTeam = async (teamId, memberId, req) => {
  let session = null;
  if (checkIsReplicaSet()) { session = await mongoose.startSession(); session.startTransaction(); }

  try {
    const team = await Team.findOne({ _id: teamId, isDeleted: false }).session(session);
    if (!team) {
      const err = new Error('Team not found'); err.code = 'TM_008'; err.statusCode = 404; throw err;
    }

    if (team.leader.toString() === memberId.toString()) {
      const err = new Error('Leader cannot leave without transferring leadership.'); err.code = 'TM_012'; err.statusCode = 400; throw err;
    }

    validateLock(team);

    const memberIndex = team.members.findIndex(m => m.user.toString() === memberId.toString());
    if (memberIndex === -1) {
      const err = new Error('Member not found in team.'); err.code = 'TM_009'; err.statusCode = 404; throw err;
    }

    // Remove Member
    team.members.splice(memberIndex, 1);
    await team.save({ session });

    // Audit & Notify Leader
    await new AuditLog({
      user: memberId, userId: req.user.userId, action: 'MEMBER_LEFT', targetId: teamId.toString(),
      ip: req.ip, device: req.headers['user-agent']
    }).save({ session });

    const leader = await User.findById(team.leader).session(session);
    await NotificationService.send({
      userId: team.leader,
      email: leader.email,
      title: 'NEXUS 2026 - Member Left',
      message: `${req.user.fullName} has left your team.`,
      type: 'WARNING',
      session
    });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return true;
  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.transferLeadership = async (teamId, newLeaderId, currentLeaderId, req) => {
  let session = null;
  if (checkIsReplicaSet()) { session = await mongoose.startSession(); session.startTransaction(); }

  try {
    const team = await Team.findOne({ _id: teamId, isDeleted: false }).session(session);
    if (!team) {
      const err = new Error('Team not found'); err.code = 'TM_008'; err.statusCode = 404; throw err;
    }

    if (team.leader.toString() !== currentLeaderId.toString()) {
      const err = new Error('Only the Leader can perform this action.'); err.code = 'TM_006'; err.statusCode = 403; throw err;
    }

    validateLock(team);

    const newLeaderIndex = team.members.findIndex(m => m.user.toString() === newLeaderId.toString());
    if (newLeaderIndex === -1) {
      const err = new Error('Target user is not a member of this team.'); err.code = 'TM_009'; err.statusCode = 404; throw err;
    }

    // Transfer Leadership
    team.leader = newLeaderId;
    await team.save({ session });

    // Audit & Notify
    await new AuditLog({
      user: currentLeaderId, userId: req.user.userId, action: 'LEADER_TRANSFERRED', targetId: teamId.toString(),
      ip: req.ip, device: req.headers['user-agent']
    }).save({ session });

    const newLeader = await User.findById(newLeaderId).session(session);
    await NotificationService.send({
      userId: newLeaderId,
      email: newLeader.email,
      title: 'NEXUS 2026 - Leadership Transferred',
      message: `You are now the Leader of team ${team.teamName}.`,
      type: 'SYSTEM',
      session
    });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return team;
  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.getTeamTimeline = async (teamId) => {
  // Query all AuditLogs where targetId matches this Team's Object ID (or string representation)
  // Also getting team creation logs, invite logs mapped to this team.
  return await AuditLog.find({ targetId: teamId.toString() })
    .populate('user', 'fullName')
    .sort({ createdAt: -1 })
    .limit(50);
};
