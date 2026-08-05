const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register a new user (Signup)
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    let user = await User.findOne({ email });
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified. Please log in.' });
      }
      // Overwrite unverified user
      user.fullName = fullName;
      user.mobile = mobile;
      user.password = password;
      user.verificationOTP = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        fullName,
        email,
        mobile,
        password,
        verificationOTP: otp,
        otpExpiry,
      });
    }

    // Send OTP Email
    const message = `
      <h2>Welcome to NEXUS 2026</h2>
      <p>Your email verification OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'NEXUS 2026 - Email Verification OTP',
        html: message,
      });
    } catch (emailErr) {
      console.error('[Signup] Email failed to send. Developer fallback OTP:', otp);
      // We don't throw, we allow them to proceed (they can read OTP from console in dev)
    }

    res.status(201).json({
      message: 'Signup successful. Please verify your email.',
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify Email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+verificationOTP +otpExpiry');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.verificationOTP !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Auto Login after verification
    generateToken(res, user._id);

    res.status(200).json({
      message: 'Email verified successfully',
      _id: user._id,
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = generateOTP();
    user.verificationOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    const message = `<p>Your new verification OTP is: <strong>${otp}</strong> (Valid for 10 minutes)</p>`;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'NEXUS 2026 - Resend OTP',
        html: message,
      });
    } catch (emailErr) {
      console.error('[Resend OTP] Email failed to send. Developer fallback OTP:', otp);
      // Don't fail the API, allow the dev to see it in console
    }

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first', notVerified: true });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin Login
// @route   POST /api/v1/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    let adminUser = await User.findOne({ email });
    if (!adminUser) {
      adminUser = await User.create({
        fullName: 'System Administrator',
        email: process.env.ADMIN_EMAIL,
        mobile: '0000000000',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isVerified: true
      });
    } else if (adminUser.role !== 'admin') {
      adminUser.role = 'admin';
      await adminUser.save();
    }

    generateToken(res, adminUser._id);

    res.status(200).json({
      _id: adminUser._id,
      userId: adminUser.userId,
      fullName: adminUser.fullName,
      email: adminUser.email,
      role: adminUser.role
    });
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    const otp = generateOTP();
    user.verificationOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    const message = `<p>Your password reset OTP is: <strong>${otp}</strong> (Valid for 10 minutes)</p>`;
    
    await sendEmail({
      email: user.email,
      subject: 'NEXUS 2026 - Password Reset',
      html: message,
    });

    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+verificationOTP +otpExpiry');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationOTP !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.verificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
