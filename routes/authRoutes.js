const express = require('express');
const router = express.Router();

// ✅ Import only existing controllers
const {
  registerUser,
  loginUser,
  googleLogin
} = require('../controllers/authController');

// ✅ Register route
router.post('/register', registerUser);

// ✅ Login route
router.post('/login', loginUser);

// ✅ Google login route
router.post('/google-login', googleLogin);

module.exports = router;
