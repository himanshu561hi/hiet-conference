const mongoose = require('mongoose');

const correctionItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Paper Title', 'Abstract', 'Keywords', 'PDF', 'Author Details', 'Registration Information', 'Other']
  },
  comment: {
    type: String,
    required: true
  }
});

const reviewSchema = new mongoose.Schema({
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  reviewRound: {
    type: Number,
    required: true,
    default: 1
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['Approved', 'Rejected', 'Needs Correction', 'Resubmitted'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Historical'],
    default: 'Active'
  },
  publicNotes: {
    type: String, // Visible to leader
  },
  internalNotes: {
    type: String, // Visible ONLY to admin
  },
  correctionItems: [correctionItemSchema]
}, { timestamps: true });

// Indexes for performance
reviewSchema.index({ registrationId: 1 });
reviewSchema.index({ reviewRound: 1 });
reviewSchema.index({ status: 1 });

module.exports = mongoose.model('Review', reviewSchema);
