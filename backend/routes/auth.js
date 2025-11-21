const express = require('express');
const { auth, adminAuth, superAdminAuth } = require('../middleware/auth');
const { 
  register, 
  login, 
  adminLogin, 
  verifyToken, 
  getMe, 
  verifyAdminToken, 
  getAdminMe, 
  createAdmin 
} = require('../controllers/authController');
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

// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public
router.post('/admin/login', userValidation.login, adminLogin);

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', auth, verifyToken);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// Admin-specific routes
// @route   GET /api/auth/admin/verify
// @desc    Verify admin token
// @access  Private (Admin)
router.get('/admin/verify', adminAuth, verifyAdminToken);

// @route   GET /api/auth/admin/me
// @desc    Get current admin
// @access  Private (Admin)
router.get('/admin/me', adminAuth, getAdminMe);

// @route   POST /api/auth/admin/create
// @desc    Create new admin
// @access  Private (Super Admin)
router.post('/admin/create', adminAuth, superAdminAuth, userValidation.register, createAdmin);

module.exports = router;