const express = require('express');
const router = express.Router();
const { publicRegister, sendRegistrationOTP, verifyRegistrationOTP } = require('../controllers/publicRegistrationController');
const upload = require('../middlewares/uploadMiddleware');

// POST /api/v1/public/send-otp
router.post('/send-otp', sendRegistrationOTP);

// POST /api/v1/public/verify-otp
router.post('/verify-otp', verifyRegistrationOTP);

// POST /api/v1/public/register
router.post('/register', upload, publicRegister);

module.exports = router;
