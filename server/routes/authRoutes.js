const express = require('express');
const router = express.Router();
const {
  signup,
  verifyEmail,
  resendOTP,
  login,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
