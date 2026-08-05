const express = require('express');
const router = express.Router();
const { sendRequest, acceptRequest, rejectRequest, getTeamRequests, getUserRequests, cancelRequest } = require('../controllers/requestController');
const { validateSendRequest } = require('../validators/requestValidator');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send', protect, validateSendRequest, sendRequest);
router.get('/team', protect, getTeamRequests);
router.get('/me', protect, getUserRequests);
router.post('/:requestId/accept', protect, acceptRequest);
router.post('/:requestId/reject', protect, rejectRequest);
router.post('/:requestId/cancel', protect, cancelRequest);

module.exports = router;
