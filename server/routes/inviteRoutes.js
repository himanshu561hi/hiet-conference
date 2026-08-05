const express = require('express');
const router = express.Router();
const { sendInvite, acceptInvite, rejectInvite, getMyInvites, getTeamInvites, cancelInvite } = require('../controllers/inviteController');
const { validateSendInvite } = require('../validators/inviteValidator');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send', protect, validateSendInvite, sendInvite);
router.post('/:inviteId/accept', protect, acceptInvite);
router.post('/:inviteId/reject', protect, rejectInvite);
router.post('/:inviteId/cancel', protect, cancelInvite);
router.get('/me', protect, getMyInvites);
router.get('/team', protect, getTeamInvites);

module.exports = router;
