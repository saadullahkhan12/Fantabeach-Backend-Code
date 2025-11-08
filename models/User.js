const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      trim: true,
      unique: true,
      minlength: 3
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      default: ''
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    credits: {
      type: Number,
      default: 0
    },
    // NEW FIELD: mark when user verified via OTP
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Hide password in responses
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

module.exports = mongoose.model('User', userSchema);
