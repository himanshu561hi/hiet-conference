const express = require('express');
const router = express.Router();
const { removeMember, leaveTeam, transferLeadership, getTeamTimeline } = require('../controllers/teamManagementController');
const { validateTargetUser } = require('../validators/teamManagementValidator');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:teamId/remove-member', protect, validateTargetUser, removeMember);
router.post('/:teamId/leave', protect, leaveTeam);
router.post('/:teamId/transfer-leadership', protect, validateTargetUser, transferLeadership);
router.get('/:teamId/timeline', protect, getTeamTimeline);

module.exports = router;
