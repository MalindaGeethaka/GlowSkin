const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, deleteImage } = require('../controllers/uploadController');
const { uploadProduct } = require('../utils/uploadHelpers');

const router = express.Router();

// @route   POST /api/uploads/image
// @desc    Upload a single image
// @access  Private/Admin
router.post('/image', authenticate, isAdmin, uploadProduct.single('image'), uploadSingle);

// @route   POST /api/uploads/images
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/images', authenticate, isAdmin, uploadProduct.array('images', 5), uploadMultiple);

// @route   DELETE /api/uploads/:filename
// @desc    Delete an image from local storage
// @access  Private/Admin
router.delete('/:filename(*)', authenticate, isAdmin, deleteImage);

module.exports = router;
