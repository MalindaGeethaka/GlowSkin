const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', authenticate, isAdmin, getAllUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, getUserStats);

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get('/:id', authenticate, isAdmin, getUserById);

// @route   POST /api/users
// @desc    Create user (Admin only)
// @access  Private/Admin
router.post('/', authenticate, isAdmin, createUser);

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
