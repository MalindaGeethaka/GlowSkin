const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

// Middleware to check if user is customer or admin
const isCustomerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Customer or admin privileges required.' 
    });
  }
};

// Middleware to check if user owns the resource or is admin
const isOwnerOrAdmin = (userIdField = 'user') => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }
    
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (req.user._id.toString() === resourceUserId) {
      return next();
    }
    
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. You can only access your own resources.' 
    });
  };
};

module.exports = {
  authenticate,
  isAdmin,
  isCustomerOrAdmin,
  isOwnerOrAdmin
};
