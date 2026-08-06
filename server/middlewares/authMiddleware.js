const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization Bearer header first (essential for cross-domain Netlify -> Vercel calls), then cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexus2026_fallback_secret');

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password -verificationOTP -otpExpiry');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'editorial')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin or editorial member' });
  }
};

module.exports = { protect, admin };

