const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userId: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: true
  },
  targetId: {
    type: String, // e.g., 'HIET/TM/0001'
  },
  ip: {
    type: String
  },
  device: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
