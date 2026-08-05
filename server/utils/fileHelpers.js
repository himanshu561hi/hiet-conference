const crypto = require('crypto');

exports.generateChecksum = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

exports.generateFileVersion = (previousVersionStr) => {
  if (!previousVersionStr) return 'v1';
  const match = previousVersionStr.match(/v(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `v${num + 1}`;
  }
  return 'v1';
};

exports.generateUniqueFilename = (teamId, versionStr, hash) => {
  const shortHash = hash.substring(0, 8);
  return `NEXUS2026_${teamId}_${versionStr}_${shortHash}.pdf`;
};
