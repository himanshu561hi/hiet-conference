const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    unique: true,
    required: true
  },
  teamName: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50
  },
  teamType: {
    type: String,
    enum: ['Solo', 'Team'],
    required: true
  },
  joinCode: {
    type: String,
    unique: true,
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userId: String,
    name: String,
    email: String,
    mobile: String,
    college: String,
    branch: String,
    year: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: [
      'Draft',
      'Registration Started',
      'Registration Completed',
      'Paper Uploaded',
      'Submitted',
      'Under Review',
      'Approved',
      'Rejected',
      'Needs Correction',
      'Locked'
    ],
    default: 'Draft'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
