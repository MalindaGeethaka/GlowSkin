const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiryStats
} = require('../controllers/inquiryController');

const router = express.Router();

// @route   POST /api/inquiries
// @desc    Create a new inquiry
// @access  Public
router.post('/', createInquiry);

// @route   GET /api/inquiries
// @desc    Get all inquiries (Admin only)
// @access  Private/Admin
router.get('/', authenticate, isAdmin, getAllInquiries);

// @route   GET /api/inquiries/stats
// @desc    Get inquiry statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, getInquiryStats);

// @route   GET /api/inquiries/:id
// @desc    Get a single inquiry by ID (Admin only)
// @access  Private/Admin
router.get('/:id', authenticate, isAdmin, getInquiryById);

// @route   PUT /api/inquiries/:id
// @desc    Update an inquiry and respond (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, updateInquiry);

// @route   DELETE /api/inquiries/:id
// @desc    Delete an inquiry (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, deleteInquiry);

module.exports = router;
