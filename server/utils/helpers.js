// Common response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Success response
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

// Error response
const sendError = (res, message, statusCode = 400, error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

// Validation error response
const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors,
    timestamp: new Date().toISOString()
  });
};

// Pagination helper
const getPaginationData = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / pageSize);
  const skip = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems: total,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

// Generate pagination response
const generatePaginationResponse = (data, pagination) => {
  return {
    items: data,
    pagination: {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage
    }
  };
};

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Generate random string
const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Format currency (LKR)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(amount);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Sri Lankan format)
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Generate order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `GS${timestamp}${random}`;
};

// Calculate discount
const calculateDiscount = (originalPrice, discountPercentage) => {
  const discount = (originalPrice * discountPercentage) / 100;
  const finalPrice = originalPrice - discount;
  return {
    originalPrice,
    discountPercentage,
    discountAmount: discount,
    finalPrice
  };
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Check if user is admin
const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Check if user is customer
const isCustomer = (user) => {
  return user && user.role === 'customer';
};

// Format date
const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  getPaginationData,
  generatePaginationResponse,
  asyncHandler,
  generateRandomString,
  formatCurrency,
  isValidEmail,
  isValidPhoneNumber,
  generateOrderId,
  calculateDiscount,
  sanitizeInput,
  isAdmin,
  isCustomer,
  formatDate
};
