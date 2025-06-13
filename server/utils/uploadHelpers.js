const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration for product images
const uploadProduct = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Multer configuration for single file
const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Delete local file
const deleteLocalFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../uploads', path.basename(filePath));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

// Validate image file
const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Maximum size is 5MB.'
    };
  }

  return { isValid: true };
};

// Get file URL for serving
const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

module.exports = {
  uploadProduct,
  uploadSingle,
  deleteLocalFile,
  validateImageFile,
  getFileUrl
};
