const mongoose = require('mongoose');
const Team = require('../models/Team');
const UserProfile = require('../models/UserProfile');
const AuditLog = require('../models/AuditLog');
const { generateTeamId, generateJoinCode } = require('../utils/generators');

/**
 * Creates a new team enforcing strict security rules.
 * Utilizes MongoDB Transactions if running in a Replica Set, 
 * otherwise falls back to standard sequential execution.
 */
exports.createTeamService = async (user, teamName, teamType, req) => {
  let session = null;
  const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // Rule: 1 User = 1 Active Team. Check if user is already in a team.
    const existingTeam = await Team.findOne({ 
      'members.user': user._id, 
      isDeleted: false 
    }).session(session);

    if (existingTeam) {
      const error = new Error('User already belongs to another team.');
      error.code = 'TM_002';
      error.statusCode = 400;
      throw error;
    }

    // Uniqueness Check for Team Name
    const nameExists = await Team.findOne({ teamName, isDeleted: false }).session(session);
    if (nameExists) {
      const error = new Error('Team name already exists.');
      error.code = 'TM_001';
      error.statusCode = 400;
      throw error;
    }

    // Generate Identifiers
    const teamId = await generateTeamId();
    const joinCode = await generateJoinCode();

    // Create Team
    const newTeam = new Team({
      teamId,
      teamName,
      teamType,
      joinCode,
      leader: user._id,
      members: [{
        user: user._id,
        userId: user.userId
      }],
      status: 'Draft',
      createdBy: user._id,
      updatedBy: user._id
    });

    await newTeam.save({ session });

    // Audit Logging
    const auditLog = new AuditLog({
      user: user._id,
      userId: user.userId,
      action: 'TEAM_CREATED',
      targetId: teamId,
      ip: req.ip || req.connection.remoteAddress,
      device: req.headers['user-agent']
    });
    
    await auditLog.save({ session });

    // Commit Transaction if active
    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    return newTeam;

  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};
