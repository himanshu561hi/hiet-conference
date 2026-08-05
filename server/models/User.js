const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Do not return password by default
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// Generate HIET/USR/XXXX before saving if new
userSchema.pre('save', async function () {
  if (this.isNew) {
    try {
      const lastUser = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
      let nextNum = 1001;
      if (lastUser && lastUser.userId) {
        const parts = lastUser.userId.split('/');
        const lastNum = parseInt(parts[2], 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }
      this.userId = `HIET/USR/${nextNum}`;
    } catch (err) {
      throw err;
    }
  }

  // Hash password
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
