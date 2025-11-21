const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is for admin
    if (decoded.userType !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin token' });
    }

    const admin = await Admin.findById(decoded.userId).select('-password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin not found or inactive' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check admin permissions
const checkAdminPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.permissions[permission]) {
      return res.status(403).json({ 
        message: `Access denied. ${permission} permission required.` 
      });
    }
    next();
  };
};

// Super admin only middleware
const superAdminAuth = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({ 
      message: 'Access denied. Super admin privileges required.' 
    });
  }
  next();
};

// Flexible auth middleware that accepts both users and admins
const flexibleAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType === 'admin') {
      // Admin authentication
      const admin = await Admin.findById(decoded.userId).select('-password');
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: 'Admin not found or inactive' });
      }
      req.admin = admin;
      req.userType = 'admin';
    } else {
      // Regular user authentication (userType is 'user' or undefined for backward compatibility)
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      req.userType = 'user';
    }

    next();
  } catch (error) {
    console.error('Flexible auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { 
  auth, 
  adminAuth, 
  checkAdminPermission, 
  superAdminAuth,
  flexibleAuth
};