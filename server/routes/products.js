const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', authenticate, isAdmin, validateProduct, createProduct);

// @route   GET /api/products
// @desc    Get all products with optional filtering
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/stats
// @desc    Get product statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, getProductStats);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, validateProduct, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, deleteProduct);

module.exports = router;
