const express = require('express');
const router = express.Router();
const { createTeam, getMyTeam } = require('../controllers/teamController');
const { validateCreateTeam } = require('../validators/teamValidator');
const { protect } = require('../middlewares/authMiddleware');

// Route -> Validation -> Controller
router.post('/create', protect, validateCreateTeam, createTeam);
router.get('/me', protect, getMyTeam);

module.exports = router;
