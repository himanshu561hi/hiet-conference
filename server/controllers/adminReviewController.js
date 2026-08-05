const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const Review = require('../models/Review');
const AuditLog = require('../models/AuditLog');
const NotificationService = require('../services/NotificationService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

const checkIsReplicaSet = () => process.env.NODE_ENV !== 'test' && mongoose.connection.client?.topology?.s?.description?.type !== 'Single';

// @desc    Approve a registration
// @route   POST /api/v1/admin/review/approve
// @access  Private/Admin
exports.approveRegistration = async (req, res) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const { registrationId } = req.body;
    
    const registration = await Registration.findById(registrationId)
      .populate({ path: 'team', populate: { path: 'leader', select: 'name email' } })
      .session(session);
    if (!registration) {
      if (session) await session.abortTransaction();
      return sendError(res, 404, 'ADM_002', 'Registration Not Found', null, req);
    }

    if (registration.status === 'Approved') {
      if (session) await session.abortTransaction();
      return sendError(res, 400, 'ADM_010', 'Registration is already approved.', null, req);
    }

    const team = registration.team;
    
    // Update Registration
    registration.status = 'Approved';
    await registration.save({ session });

    // Update Team
    team.status = 'Approved';
    team.isLocked = true; // Permanently locked
    await team.save({ session });

    // Create Review Round Entry
    const currentRound = (await Review.countDocuments({ registrationId }).session(session)) + 1;
    await Review.create([{
      registrationId,
      reviewRound: currentRound,
      reviewerId: req.user._id,
      action: 'Approved',
      status: 'Historical'
    }], { session });

    // Audit Log
    await AuditLog.create([{
      user: req.user._id,
      action: 'REGISTRATION_APPROVED',
      targetId: team._id.toString()
    }], { session });

    // Send Email
    await NotificationService.send({
      userId: team.leader,
      email: team.leader.email, // We need the leader's email. Let's populate leader!
      title: 'Registration Approved',
      message: `Congratulations! Your registration (${registration.registrationNumber}) for team ${team.teamName} has been approved.`,
      type: 'success',
      session
    });

    if (session) await session.commitTransaction();

    return sendSuccess(res, 200, 'Registration approved successfully', {}, req);

  } catch (error) {
    if (session) await session.abortTransaction();
    console.error(error);
    return sendError(res, 500, 'ADM_007', 'Transaction Failed', null, req);
  } finally {
    if (session) session.endSession();
  }
};

// @desc    Reject a registration
// @route   POST /api/v1/admin/review/reject
// @access  Private/Admin
exports.rejectRegistration = async (req, res) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const { registrationId, reason } = req.body;
    
    if (!reason || reason.trim().length < 20) {
      if (session) await session.abortTransaction();
      return sendError(res, 400, 'ADM_011', 'Mandatory rejection reason (min 20 characters) required.', null, req);
    }
    
    const registration = await Registration.findById(registrationId)
      .populate({ path: 'team', populate: { path: 'leader', select: 'name email' } })
      .session(session);
    if (!registration) {
      if (session) await session.abortTransaction();
      return sendError(res, 404, 'ADM_002', 'Registration Not Found', null, req);
    }

    const team = registration.team;
    
    // Update Registration
    registration.status = 'Rejected';
    await registration.save({ session });

    // Update Team
    team.status = 'Rejected';
    team.isLocked = true; // Still locked
    await team.save({ session });

    // Create Review Entry
    const currentRound = (await Review.countDocuments({ registrationId }).session(session)) + 1;
    await Review.create([{
      registrationId,
      reviewRound: currentRound,
      reviewerId: req.user._id,
      action: 'Rejected',
      publicNotes: reason,
      status: 'Historical'
    }], { session });

    // Audit Log
    await AuditLog.create([{
      user: req.user._id,
      action: 'REGISTRATION_REJECTED',
      targetId: team._id.toString()
    }], { session });

    // Send Email
    await NotificationService.send({
      userId: team.leader,
      email: team.leader.email,
      title: 'Registration Rejected',
      message: `Your registration (${registration.registrationNumber}) has been rejected. Reason: ${reason}`,
      type: 'error',
      session
    });

    if (session) await session.commitTransaction();

    return sendSuccess(res, 200, 'Registration rejected successfully', {}, req);

  } catch (error) {
    if (session) await session.abortTransaction();
    console.error(error);
    return sendError(res, 500, 'ADM_007', 'Transaction Failed', null, req);
  } finally {
    if (session) session.endSession();
  }
};

// @desc    Request Corrections
// @route   POST /api/v1/admin/review/needs-correction
// @access  Private/Admin
exports.requestCorrection = async (req, res) => {
  let session = null;
  if (checkIsReplicaSet()) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const { registrationId, correctionItems, internalNotes } = req.body;
    
    if (!correctionItems || correctionItems.length === 0) {
      if (session) await session.abortTransaction();
      return sendError(res, 400, 'ADM_012', 'At least one correction item is required.', null, req);
    }
    
    const registration = await Registration.findById(registrationId)
      .populate({ path: 'team', populate: { path: 'leader', select: 'name email' } })
      .session(session);
    if (!registration) {
      if (session) await session.abortTransaction();
      return sendError(res, 404, 'ADM_002', 'Registration Not Found', null, req);
    }

    const team = registration.team;
    
    // Update Registration
    registration.status = 'Needs Correction';
    await registration.save({ session });

    // Update Team (Unlock for editing, but Team is not purely "Draft", it's "Needs Correction")
    team.status = 'Needs Correction';
    team.isLocked = false; 
    await team.save({ session });

    // Create Review Entry
    const currentRound = (await Review.countDocuments({ registrationId }).session(session)) + 1;
    await Review.create([{
      registrationId,
      reviewRound: currentRound,
      reviewerId: req.user._id,
      action: 'Needs Correction',
      internalNotes,
      correctionItems,
      status: 'Active' // Active means it's the current active review round waiting for resubmit
    }], { session });

    // Audit Log
    await AuditLog.create([{
      user: req.user._id,
      action: 'CORRECTION_REQUESTED',
      targetId: team._id.toString()
    }], { session });

    // Send Email
    await NotificationService.send({
      userId: team.leader,
      email: team.leader.email,
      title: 'Action Required: Registration Needs Correction',
      message: `Your registration (${registration.registrationNumber}) needs corrections. Please check your dashboard for details.`,
      type: 'warning',
      session
    });

    if (session) await session.commitTransaction();

    return sendSuccess(res, 200, 'Correction requested successfully', {}, req);

  } catch (error) {
    if (session) await session.abortTransaction();
    console.error(error);
    return sendError(res, 500, 'ADM_007', 'Transaction Failed', null, req);
  } finally {
    if (session) session.endSession();
  }
};

// @desc    Get Review History
// @route   GET /api/v1/admin/review/history/:registrationId
// @access  Private/Admin
exports.getReviewHistory = async (req, res) => {
  try {
    const history = await Review.find({ registrationId: req.params.registrationId })
      .populate('reviewerId', 'name email profile')
      .sort({ reviewRound: -1 });

    return sendSuccess(res, 200, 'History retrieved', { history }, req);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'ADM_013', 'Failed to fetch history', null, req);
  }
};
