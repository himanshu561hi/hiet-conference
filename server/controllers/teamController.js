const teamService = require('../services/teamService');
const sendResponse = require('../middlewares/responseHandler');

// @desc    Create a new Team
// @route   POST /api/v1/team/create
// @access  Private
exports.createTeam = async (req, res) => {
  try {
    const { teamName, teamType } = req.body;
    
    // Pass execution to Service Layer
    const team = await teamService.createTeamService(req.user, teamName, teamType, req);

    return sendResponse(res, 201, 'Team created successfully.', {
      teamId: team.teamId,
      teamName: team.teamName,
      teamType: team.teamType,
      joinCode: team.joinCode,
      status: team.status,
      membersCount: team.members.length,
      createdAt: team.createdAt
    });

  } catch (error) {
    console.error('[CreateTeam Error]:', error);
    
    // Map to standardized error codes
    const code = error.code || 'SYS_500';
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return res.status(statusCode).json({
      success: false,
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }
};

// @desc    Get Current User's Team
// @route   GET /api/v1/team/me
// @access  Private
exports.getMyTeam = async (req, res) => {
  try {
    const Team = require('../models/Team'); // Inline require to avoid circular deps if any
    const team = await Team.findOne({ 'members.user': req.user._id, isDeleted: false })
      .populate('leader', 'fullName email mobile')
      .populate('members.user', 'fullName email mobile');

    if (!team) {
      return res.status(404).json({
        success: false,
        code: 'TM_008',
        message: 'Team not found.',
        timestamp: new Date().toISOString(),
        requestId: req.id
      });
    }

    // Use standardized response
    const sendResponse = require('../middlewares/responseHandler');
    return sendResponse(res, 200, 'Team retrieved successfully.', team);

  } catch (error) {
    console.error('[GetMyTeam Error]:', error);
    return res.status(500).json({
      success: false,
      code: 'SYS_500',
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }
};

