const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Expired'],
    default: 'Pending'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
}, { timestamps: true });

joinRequestSchema.index({ team: 1, member: 1, status: 1 });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
