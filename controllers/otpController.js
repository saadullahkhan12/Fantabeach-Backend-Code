const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');

// Helper: generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Step 1: Request OTP for password reset
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    // Delete existing OTPs for this user
    await Otp.deleteMany({ userId: user._id });

    // Create new OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await Otp.create({ userId: user._id, otpCode, expiresAt });

    // (In production, send via email/SMS — here we just return for testing)
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (valid for 5 minutes)',
      otp: otpCode
    });
  } catch (err) {
    console.error('OTP Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error while requesting OTP' });
  }
};

// ✅ Step 2: Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const otpRecord = await Otp.findOne({ userId: user._id, otpCode: otp });
    if (!otpRecord)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ userId: user._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.'
    });
  } catch (err) {
    console.error('OTP Verify Error:', err);
    res.status(500).json({ success: false, message: 'Server error while verifying OTP' });
  }
};

// ✅ Step 3: Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const otpRecord = await Otp.findOne({ userId: user._id, otpCode: otp });
    if (!otpRecord)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ userId: user._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Clean up OTPs after successful reset
    await Otp.deleteMany({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error while resetting password' });
  }
};
