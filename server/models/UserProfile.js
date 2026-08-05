const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
    default: ''
  },
  institute: {
    type: String,
    required: [true, 'Institute name is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  course: {
    type: String,
    required: [true, 'Course is required']
  },
  year: {
    type: String,
    required: [true, 'Year of study is required']
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required']
  },
  alternateEmail: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: '' // Cloudinary URL will be stored here later
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
