const { sendSuccess, sendError } = require('../utils/helpers');
const { deleteFromCloudinary } = require('../utils/uploadHelpers');

// Upload single image
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    sendSuccess(res, 'File uploaded successfully', {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload single error:', error);
    sendError(res, 'Server error uploading file', 500);
  }
};

// Upload multiple images
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, 'No files uploaded', 400);
    }

    const files = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    sendSuccess(res, 'Files uploaded successfully', files);
  } catch (error) {
    console.error('Upload multiple error:', error);
    sendError(res, 'Server error uploading files', 500);
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return sendError(res, 'Public ID is required', 400);
    }

    const result = await deleteFromCloudinary(publicId);
    
    if (result.result === 'ok') {
      sendSuccess(res, 'Image deleted successfully');
    } else {
      sendError(res, 'Failed to delete image', 400);
    }
  } catch (error) {
    console.error('Delete image error:', error);
    sendError(res, 'Server error deleting image', 500);
  }
};

// Get upload statistics (Admin only)
const getUploadStats = async (req, res) => {
  try {
    // This would typically require tracking uploads in a database
    // For now, return basic Cloudinary usage info
    const stats = {
      message: 'Upload statistics would be available with enhanced tracking',
      note: 'Consider implementing upload tracking in database for detailed statistics'
    };

    sendSuccess(res, 'Upload statistics retrieved', stats);
  } catch (error) {
    console.error('Get upload stats error:', error);
    sendError(res, 'Server error retrieving upload statistics', 500);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteImage,
  getUploadStats
};
