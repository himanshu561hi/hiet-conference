const registrationService = require('../services/registrationService');
const Team = require('../models/Team');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

/**
 * Ensures the requesting user is the leader of the team.
 * (Since teams are deeply integrated, we determine the active team for the user here)
 */
const requireLeader = async (req, res) => {
  const team = await Team.findOne({ members: { $elemMatch: { user: req.user._id } }, isDeleted: false });
  if (!team) {
    sendError(res, 404, 'TM_008', 'Team not found', null, req);
    return null;
  }
  if (team.leader.toString() !== req.user._id.toString()) {
    sendError(res, 403, 'REG_006', 'Only the Team Leader can perform this action.', null, req);
    return null;
  }
  return team;
};

const requireMember = async (req, res) => {
  const team = await Team.findOne({ members: { $elemMatch: { user: req.user._id } }, isDeleted: false });
  if (!team) {
    sendError(res, 404, 'TM_008', 'Team not found', null, req);
    return null;
  }
  return team;
};

exports.getRegistrationMe = async (req, res) => {
  try {
    const team = await requireMember(req, res);
    if (!team) return; // Response already sent

    const registration = await registrationService.getDraft(team._id);
    
    let activeReview = null;
    if (team.status === 'Needs Correction') {
      const Review = require('../models/Review');
      activeReview = await Review.findOne({ registrationId: registration._id, status: 'Active' });
    }

    return sendSuccess(res, 200, 'Registration fetched successfully', { 
      registration,
      activeReview
    }, req);
  } catch (error) {
    const code = error.code || 'SYS_500';
    return sendError(res, error.statusCode || 500, code, error.message, null, req);
  }
};

exports.saveDetails = async (req, res) => {
  try {
    const team = await requireLeader(req, res);
    if (!team) return;

    const updatedRegistration = await registrationService.saveDetails(team._id, req.user._id, req.body);
    return sendSuccess(res, 200, 'Draft saved successfully', { 
      version: updatedRegistration.version, 
      lastSaved: updatedRegistration.updatedAt 
    }, req);
  } catch (error) {
    console.error('[saveDetails Error]:', error);
    const code = error.code || 'SYS_500';
    return sendError(res, error.statusCode || 500, code, error.message, null, req);
  }
};

exports.uploadPdf = async (req, res) => {
  try {
    const team = await requireLeader(req, res);
    if (!team) return;

    if (!req.file) {
      return sendError(res, 400, 'SYS_400', 'No PDF file uploaded', null, req);
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const updatedRegistration = await registrationService.processUpload(
      team._id, 
      req.user._id, 
      fileBuffer, 
      originalName, 
      mimeType
    );

    return sendSuccess(res, 200, 'PDF uploaded successfully', { 
      fileUrl: updatedRegistration.fileUrl,
      version: updatedRegistration.version
    }, req);

  } catch (error) {
    const code = error.code || 'SYS_500';
    return sendError(res, error.statusCode || 500, code, error.message, null, req);
  }
};

exports.finalSubmit = async (req, res) => {
  try {
    const team = await requireLeader(req, res);
    if (!team) return;

    const updatedRegistration = await registrationService.finalSubmit(team._id, req.user._id);

    return sendSuccess(res, 200, 'Registration successfully submitted and locked', {
      registrationNumber: updatedRegistration.registrationNumber,
      status: updatedRegistration.status
    }, req);

  } catch (error) {
    const code = error.code || 'SYS_500';
    return sendError(res, error.statusCode || 500, code, error.message, null, req);
  }
};

exports.resubmit = async (req, res) => {
  try {
    const team = await requireLeader(req, res);
    if (!team) return;

    const updatedRegistration = await registrationService.resubmit(team._id, req.user._id);

    return sendSuccess(res, 200, 'Registration successfully resubmitted', {
      registrationNumber: updatedRegistration.registrationNumber,
      status: updatedRegistration.status
    }, req);

  } catch (error) {
    const code = error.code || 'SYS_500';
    return sendError(res, error.statusCode || 500, code, error.message, null, req);
  }
};
