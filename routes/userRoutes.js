const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route GET /api/users/me
router.get('/me', authMiddleware, getMe);

module.exports = router;
