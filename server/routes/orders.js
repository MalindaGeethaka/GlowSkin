const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
  getOrderStats
} = require('../controllers/orderController');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', authenticate, createOrder);

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', authenticate, isAdmin, getAllOrders);

// @route   GET /api/orders/my
// @desc    Get current user's orders
// @access  Private
router.get('/my', authenticate, getUserOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, getOrderStats);

// @route   GET /api/orders/:id
// @desc    Get a single order by ID
// @access  Private (own orders) / Private/Admin (all orders)
router.get('/:id', authenticate, getOrderById);

// @route   PUT /api/orders/:id
// @desc    Update an order (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Delete an order (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, cancelOrder);

module.exports = router;
