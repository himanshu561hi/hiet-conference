const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    unique: true
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Draft', 'Registration Completed', 'Paper Uploaded', 'Submitted', 'Under Review', 'Under Hold', 'Approved', 'Rejected', 'Needs Correction', 'Locked'],
    default: 'Submitted'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  heldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  heldByName: {
    type: String,
    default: ''
  },
  heldByEmail: {
    type: String,
    default: ''
  },
  // Module 1 Fields
  paperCategory: {
    type: String,
    default: ''
  },
  researchDomain: {
    type: String,
    default: ''
  },
  presentationPreference: {
    type: String,
    enum: ['Oral', 'Poster', ''],
    default: ''
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  additionalRemarks: {
    type: String,
    default: ''
  },
  // Phase 10.2 Fields
  conferenceTrack: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    enum: ['English'],
    default: 'English'
  },
  title: {
    type: String,
    maxLength: 120,
    default: ''
  },
  abstract: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: ''
  },
  keywords: {
    type: [String],
    validate: [v => v.length <= 7, 'Keywords cannot exceed 7'],
    default: []
  },
  authors: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    role: String,
    isCorresponding: Boolean,
    order: Number
  }],
  fileUrl: {
    type: String,
    default: ''
  },
  filePublicId: {
    type: String,
    default: ''
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  declarationChecked: {
    type: Boolean,
    default: false
  },
  isStudent: {
    type: Boolean,
    default: true
  },
  collegeName: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  organizationName: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  previousVersions: [{
    version: Number,
    fileUrl: String,
    filePublicId: String,
    payload: Object,
    savedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Indexes for Admin Queue Performance
registrationSchema.index({ status: 1 });
registrationSchema.index({ conferenceTrack: 1 });
registrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Registration', registrationSchema);
