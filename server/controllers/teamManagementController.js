const teamManagementService = require('../services/teamManagementService');
const sendResponse = require('../middlewares/responseHandler');

exports.removeMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { targetUserId } = req.body;
    const team = await teamManagementService.removeMember(teamId, targetUserId, req.user._id, req);
    return sendResponse(res, 200, 'Member removed successfully.', team);
  } catch (error) {
    const code = error.code || 'SYS_500';
    return res.status(error.statusCode || 500).json({
      success: false, code, message: error.message, timestamp: new Date().toISOString(), requestId: req.id
    });
  }
};

exports.leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    await teamManagementService.leaveTeam(teamId, req.user._id, req);
    return sendResponse(res, 200, 'You have successfully left the team.', null);
  } catch (error) {
    const code = error.code || 'SYS_500';
    return res.status(error.statusCode || 500).json({
      success: false, code, message: error.message, timestamp: new Date().toISOString(), requestId: req.id
    });
  }
};

exports.transferLeadership = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { targetUserId } = req.body; // New Leader ID
    const team = await teamManagementService.transferLeadership(teamId, targetUserId, req.user._id, req);
    return sendResponse(res, 200, 'Leadership transferred successfully.', team);
  } catch (error) {
    const code = error.code || 'SYS_500';
    return res.status(error.statusCode || 500).json({
      success: false, code, message: error.message, timestamp: new Date().toISOString(), requestId: req.id
    });
  }
};

exports.getTeamTimeline = async (req, res) => {
  try {
    const { teamId } = req.params;
    const timeline = await teamManagementService.getTeamTimeline(teamId);
    return sendResponse(res, 200, 'Timeline retrieved.', timeline);
  } catch (error) {
    return res.status(500).json({
      success: false, code: 'SYS_500', message: 'Internal Server Error', timestamp: new Date().toISOString(), requestId: req.id
    });
  }
};
