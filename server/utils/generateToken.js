const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'nexus2026_fallback_secret', {
    expiresIn: '30d',
  });

  // Set HTTP-Only Cookie with SameSite='none' & Secure for cross-domain Netlify -> Vercel support
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Required for SameSite: 'none'
    sameSite: 'none', // Allow cross-site request sent from netlify.app to vercel.app
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

module.exports = generateToken;
