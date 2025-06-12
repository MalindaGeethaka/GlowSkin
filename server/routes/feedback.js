const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');
const {
  submitFeedback,
  getAllFeedback,
  deleteFeedback,
  getFeedbackStats
} = require('../controllers/feedbackController');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Create new feedback
// @access  Private
router.post('/', authenticate, validateFeedback, submitFeedback);

// @route   GET /api/feedback
// @desc    Get all feedback (Admin only)
// @access  Private/Admin
router.get('/', authenticate, isAdmin, getAllFeedback);

// @route   GET /api/feedback/stats
// @desc    Get feedback statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, getFeedbackStats);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, deleteFeedback);

module.exports = router;
