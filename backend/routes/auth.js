const express = require('express');
const { auth } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');
const { userValidation } = require('../utils/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', userValidation.register, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', userValidation.login, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;