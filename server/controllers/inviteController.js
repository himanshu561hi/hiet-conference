const inviteService = require('../services/inviteService');
const sendResponse = require('../middlewares/responseHandler');

exports.sendInvite = async (req, res) => {
  try {
    const { inviteeIdentifier } = req.body;
    const invitation = await inviteService.sendInvite(req.user._id, inviteeIdentifier, req);
    return sendResponse(res, 201, 'Invitation sent successfully.', invitation);
  } catch (error) {
    console.error('[SendInvite Error]:', error);
    const code = error.code || 'SYS_500';
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      code,
      message: error.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const team = await inviteService.acceptInvite(req.user._id, inviteId, req);
    return sendResponse(res, 200, 'Invitation accepted successfully. You have joined the team.', team);
  } catch (error) {
    console.error('[AcceptInvite Error]:', error);
    const code = error.code || 'SYS_500';
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false, code, message: error.message, timestamp: new Date().toISOString(), requestId: req.id
    });
  }
};
exports.rejectInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invitation = await inviteService.rejectInvite(req.user._id, inviteId, req);
    return sendResponse(res, 200, 'Invitation rejected successfully.', invitation);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.cancelInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invitation = await inviteService.cancelInvite(req.user._id, inviteId, req);
    return sendResponse(res, 200, 'Invitation cancelled successfully.', invitation);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getMyInvites = async (req, res) => {
  try {
    const invites = await inviteService.getUserInvites(req.user._id);
    return sendResponse(res, 200, 'User invites fetched', invites);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getTeamInvites = async (req, res) => {
  try {
    const invites = await inviteService.getTeamInvites(req.user._id);
    return sendResponse(res, 200, 'Team invites fetched', invites);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
