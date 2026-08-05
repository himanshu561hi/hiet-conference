// utils/generators.js
const Team = require('../models/Team');

/**
 * Generate 6 character Join Code (excluding O, 0, I, 1)
 */
const generateJoinCode = async () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await Team.findOne({ joinCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

/**
 * Generate HIET/TM/XXXX padded Team ID
 */
const generateTeamId = async () => {
  const lastTeam = await Team.findOne({}, {}, { sort: { 'createdAt': -1 } });
  
  let nextNum = 1;
  if (lastTeam && lastTeam.teamId) {
    const parts = lastTeam.teamId.split('/');
    if (parts.length === 3) {
      const lastNum = parseInt(parts[2], 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
  }

  // Pad to 4 digits (e.g., 0001, 0042, 0150)
  const paddedNum = nextNum.toString().padStart(4, '0');
  return `HIET/TM/${paddedNum}`;
};

module.exports = { generateJoinCode, generateTeamId };
