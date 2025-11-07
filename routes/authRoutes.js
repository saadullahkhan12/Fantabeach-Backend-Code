const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin
} = require('../controllers/authController');

// @route POST /api/auth/register
router.post('/register', registerUser);

// @route POST /api/auth/login
router.post('/login', loginUser);

// @route POST /api/auth/google
router.post('/google', googleLogin);

module.exports = router;
