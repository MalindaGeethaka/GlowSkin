const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { uploadProduct } = require('../utils/uploadHelpers');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStats,
  addProductReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview
} = require('../controllers/productController');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product with image upload (Admin only)
// @access  Private/Admin
router.post('/', authenticate, isAdmin, uploadProduct.array('images', 5), validateProduct, createProduct);

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
// @desc    Update a product with optional image upload (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, uploadProduct.array('images', 5), validateProduct, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, deleteProduct);

// Product Reviews Routes

// @route   POST /api/products/:id/reviews
// @desc    Add a review to a product
// @access  Private
router.post('/:id/reviews', authenticate, addProductReview);

// @route   GET /api/products/:id/reviews
// @desc    Get all reviews for a product
// @access  Public
router.get('/:id/reviews', getProductReviews);

// @route   PUT /api/products/:id/reviews/:reviewId
// @desc    Update a review
// @access  Private
router.put('/:id/reviews/:reviewId', authenticate, updateProductReview);

// @route   DELETE /api/products/:id/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:id/reviews/:reviewId', authenticate, deleteProductReview);

module.exports = router;
