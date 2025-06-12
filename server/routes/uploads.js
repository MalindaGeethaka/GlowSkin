const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { uploadSingle, deleteImage } = require('../controllers/uploadController');

const router = express.Router();

// @route   POST /api/uploads/image
// @desc    Upload an image to Cloudinary
// @access  Private/Admin
router.post('/image', authenticate, isAdmin, uploadSingle);

// @route   DELETE /api/uploads/:publicId
// @desc    Delete an image from Cloudinary
// @access  Private/Admin
router.delete('/:publicId', authenticate, isAdmin, deleteImage);

module.exports = router;
