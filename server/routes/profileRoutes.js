const express = require('express');
const router = express.Router();
const { initializeProfile, getMyProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/initialize', protect, initializeProfile);
router.get('/me', protect, getMyProfile);

module.exports = router;
