const mongoose = require('mongoose');
const Invitation = require('../models/Invitation');
const Team = require('../models/Team');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const NotificationService = require('./NotificationService');

const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

exports.sendInvite = async (leaderId, inviteeIdentifier, req) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // 1. Find Leader's Team
    const team = await Team.findOne({ leader: leaderId, isDeleted: false }).session(session);
    if (!team) {
      const err = new Error('Only the Team Leader can perform this action.');
      err.code = 'TM_006'; err.statusCode = 403; throw err;
    }

    if (team.status === 'Submitted' || team.status === 'Locked') {
      const err = new Error('Action blocked. The team is locked.');
      err.code = 'TM_007'; err.statusCode = 403; throw err;
    }

    if (team.members.length >= 3 || (team.teamType === 'Solo')) {
      const err = new Error('Team capacity exceeded.');
      err.code = 'TM_003'; err.statusCode = 400; throw err;
    }

    const cleanIdentifier = inviteeIdentifier.trim();
    // 2. Find Invitee (Case-insensitive email match, exact match for userId)
    const invitee = await User.findOne({
      $or: [
        { userId: cleanIdentifier },
        { email: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } }
      ]
    }).session(session);

    if (!invitee) {
      const err = new Error('User not found. Please ensure they have registered an account.');
      err.code = 'TM_008'; err.statusCode = 404; throw err;
    }

    if (invitee._id.toString() === leaderId.toString()) {
      const err = new Error('Cannot invite yourself.');
      err.code = 'TM_014'; err.statusCode = 400; throw err; // Reusing code or custom msg
    }

    // 3. Check if Invitee is in an active team
    const existingTeam = await Team.findOne({ 'members.user': invitee._id, isDeleted: false }).session(session);
    if (existingTeam) {
      const err = new Error('User already belongs to another active team.');
      err.code = 'TM_002'; err.statusCode = 400; throw err;
    }

    // 4. Check Duplicate Active Invites
    const duplicateInvite = await Invitation.findOne({
      team: team._id,
      invitee: invitee._id,
      status: { $in: ['Created', 'Sent', 'Delivered', 'Viewed'] },
      expiresAt: { $gt: new Date() }
    }).session(session);

    if (duplicateInvite) {
      const err = new Error('User already invited.');
      err.code = 'TM_014'; err.statusCode = 400; throw err;
    }

    // 5. Create Invitation
    const invitation = new Invitation({
      team: team._id,
      leader: leaderId,
      invitee: invitee._id,
      status: 'Sent'
    });
    await invitation.save({ session });

    // 6. Audit & Notify
    await new AuditLog({
      user: leaderId, userId: req.user.userId, action: 'INVITE_SENT', targetId: invitee._id.toString(),
      ip: req.ip, device: req.headers['user-agent']
    }).save({ session });

    await NotificationService.send({
      userId: invitee._id,
      email: invitee.email,
      title: 'NEXUS 2026 - Team Invitation',
      message: `You have been invited to join the team <strong>${team.teamName}</strong> by ${req.user.fullName}.`,
      type: 'INVITE_RECEIVED',
      session
    });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return invitation;

  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.acceptInvite = async (inviteeId, inviteId, req) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const invite = await Invitation.findOne({ _id: inviteId, invitee: inviteeId }).session(session);
    if (!invite || invite.status !== 'Sent') {
      const err = new Error('Invitation expired or not found.');
      err.code = 'TM_005'; err.statusCode = 400; throw err;
    }

    if (invite.expiresAt < new Date()) {
      invite.status = 'Expired';
      await invite.save({ session });
      const err = new Error('Invitation expired or not found.');
      err.code = 'TM_005'; err.statusCode = 400; throw err;
    }

    const team = await Team.findById(invite.team).session(session);
    if (team.members.length >= 3) {
      const err = new Error('Team capacity exceeded.');
      err.code = 'TM_003'; err.statusCode = 400; throw err;
    }

    // Update Invite Status
    invite.status = 'Accepted';
    await invite.save({ session });

    // Add Member
    team.members.push({ user: inviteeId, userId: req.user.userId });
    await team.save({ session });

    // Mark other pending invites for this user as Cancelled automatically
    await Invitation.updateMany(
      { invitee: inviteeId, _id: { $ne: inviteId }, status: 'Sent' },
      { $set: { status: 'Cancelled' } },
      { session }
    );

    // Audit & Notify
    await new AuditLog({
      user: inviteeId, userId: req.user.userId, action: 'INVITE_ACCEPTED', targetId: team.teamId,
      ip: req.ip, device: req.headers['user-agent']
    }).save({ session });

    const leader = await User.findById(team.leader).session(session);
    await NotificationService.send({
      userId: leader._id,
      email: leader.email,
      title: 'NEXUS 2026 - Invitation Accepted',
      message: `${req.user.fullName} has accepted your invitation and joined ${team.teamName}.`,
      type: 'INVITE_ACCEPTED',
      session
    });

    if (session) { await session.commitTransaction(); session.endSession(); }
    return team;

  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw error;
  }
};

exports.getUserInvites = async (userId) => {
  return Invitation.find({ invitee: userId, status: { $in: ['Sent', 'Delivered', 'Viewed'] } })
    .populate('team', 'teamName teamId')
    .populate('leader', 'fullName email')
    .sort({ createdAt: -1 });
};

exports.getTeamInvites = async (leaderId) => {
  const team = await Team.findOne({ leader: leaderId, isDeleted: false });
  if (!team) return [];
  return Invitation.find({ team: team._id, status: { $in: ['Sent', 'Delivered', 'Viewed', 'Pending'] } })
    .populate('invitee', 'fullName email userId')
    .sort({ createdAt: -1 });
};

exports.rejectInvite = async (userId, inviteId, req) => {
  const invitation = await Invitation.findById(inviteId);
  if (!invitation || invitation.invitee.toString() !== userId.toString()) {
    const err = new Error('Invitation not found or unauthorized'); err.statusCode = 404; throw err;
  }
  invitation.status = 'Rejected';
  await invitation.save();
  return invitation;
};

exports.cancelInvite = async (leaderId, inviteId, req) => {
  const invitation = await Invitation.findById(inviteId);
  if (!invitation || invitation.leader.toString() !== leaderId.toString()) {
    const err = new Error('Invitation not found or unauthorized'); err.statusCode = 404; throw err;
  }
  invitation.status = 'Cancelled';
  await invitation.save();
  return invitation;
};
