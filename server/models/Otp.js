const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // TTL Index: automatically remove document from MongoDB after 1 hour
  }
});

module.exports = mongoose.model('Otp', otpSchema);
