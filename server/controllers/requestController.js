const requestService = require('../services/requestService');
const sendResponse = require('../middlewares/responseHandler');

exports.sendRequest = async (req, res) => {
  try {
    const { teamId, joinCode } = req.body;
    const joinRequest = await requestService.sendRequest(req.user._id, teamId, joinCode, req);
    return sendResponse(res, 201, 'Join request sent successfully.', joinRequest);
  } catch (error) {
    console.error('[SendRequest Error]:', error);
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
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const joinRequest = await requestService.acceptRequest(req.user._id, requestId, req);
    return sendResponse(res, 200, 'Request accepted successfully.', joinRequest);
  } catch (error) {
    const code = error.code || 'SYS_500';
    return res.status(error.statusCode || 500).json({ success: false, code, message: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const joinRequest = await requestService.rejectRequest(req.user._id, requestId, req);
    return sendResponse(res, 200, 'Request rejected successfully.', joinRequest);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const joinRequest = await requestService.cancelRequest(req.user._id, requestId, req);
    return sendResponse(res, 200, 'Request cancelled successfully.', joinRequest);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getTeamRequests = async (req, res) => {
  try {
    const requests = await requestService.getTeamRequests(req.user._id);
    return sendResponse(res, 200, 'Team requests fetched', requests);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await requestService.getUserRequests(req.user._id);
    return sendResponse(res, 200, 'User requests fetched', requests);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
