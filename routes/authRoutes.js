const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Register user
router.post('/register', authController.registerUser);

// Login user
router.post('/login', authController.loginUser);

// Verify OTP
router.post('/verify-otp', authController.verifyLoginOrRegisterOtp);

module.exports = router;
