const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// @desc    Initialize User Profile (Phase 8)
// @route   POST /api/profile/initialize
// @access  Private
exports.initializeProfile = async (req, res) => {
  try {
    const { 
      gender, 
      institute, 
      department, 
      course, 
      year, 
      rollNumber, 
      alternateEmail 
    } = req.body;

    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already initialized' });
    }

    const profile = await UserProfile.create({
      user: req.user._id,
      userId: req.user.userId, // Pulled from the User model (e.g. HIET/USR/1001)
      gender,
      institute,
      department,
      course,
      year,
      rollNumber,
      alternateEmail,
    });

    res.status(201).json({
      message: 'Profile initialized successfully',
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/profile/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id }).populate('user', 'fullName email mobile');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
