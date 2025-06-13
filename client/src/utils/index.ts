// Utility functions for the client

// Get full image URL from relative path
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // In development, use the proxy - just return the path as is
  // The proxy will forward it to the backend
  if (process.env.NODE_ENV === 'development') {
    return imagePath; // Let the proxy handle it
  }
  
  // Get base URL from environment or default (for production)
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
};

// Format price with currency
export const formatPrice = (price: number): string => {
  return `LKR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
