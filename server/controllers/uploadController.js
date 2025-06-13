const { sendSuccess, sendError } = require('../utils/helpers');
const { deleteLocalFile, getFileUrl } = require('../utils/uploadHelpers');

// Upload single image
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    sendSuccess(res, 'File uploaded successfully', {
      url: getFileUrl(req.file.filename),
      filename: req.file.filename,
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
      url: getFileUrl(file.filename),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    sendSuccess(res, 'Files uploaded successfully', files);
  } catch (error) {
    console.error('Upload multiple error:', error);
    sendError(res, 'Server error uploading files', 500);
  }
};

// Delete image from local storage
const deleteImage = async (req, res) => {
  try {
    const filename = req.params[0]; // Handle nested paths with (*)

    if (!filename) {
      return sendError(res, 'Filename is required', 400);
    }

    console.log('Attempting to delete file:', filename);

    const result = deleteLocalFile(filename);
    
    if (result.success) {
      sendSuccess(res, 'Image deleted successfully', { filename });
    } else {
      console.error('File deletion failed:', result.error);
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
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '../uploads');
    
    let stats = {
      totalFiles: 0,
      totalSize: 0
    };

    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      stats.totalFiles = files.length;
      
      files.forEach(file => {
        const filePath = path.join(uploadDir, file);
        const fileStats = fs.statSync(filePath);
        stats.totalSize += fileStats.size;
      });
    }

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
