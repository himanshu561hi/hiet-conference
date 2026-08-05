const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Created', 'Sent', 'Delivered', 'Viewed', 'Accepted', 'Rejected', 'Expired', 'Cancelled'],
    default: 'Sent'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
}, { timestamps: true });

// Compound index to quickly find active invites
invitationSchema.index({ team: 1, invitee: 1, status: 1 });

module.exports = mongoose.model('Invitation', invitationSchema);
