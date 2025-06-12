const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configuration for products
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glowskin/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Storage configuration for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glowskin/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ]
  }
});

// Storage configuration for general uploads
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glowskin/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto'
  }
});

// Multer configurations
const uploadProduct = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const uploadGeneral = multer({
  storage: generalStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto'
  };
  
  return cloudinary.url(publicId, { ...defaultOptions, ...options });
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

// Extract Cloudinary public ID from URL
const extractPublicId = (url) => {
  if (!url) return null;
  
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    
    // Include folder path if present
    const folderIndex = parts.findIndex(part => part === 'glowskin');
    if (folderIndex !== -1) {
      const folderPath = parts.slice(folderIndex, -1).join('/');
      return `${folderPath}/${publicId}`;
    }
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadProduct,
  uploadAvatar,
  uploadGeneral,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  validateImageFile,
  extractPublicId
};
