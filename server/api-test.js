// API Test Routes for GlowSkin E-commerce Platform
// Use this file to test all the API endpoints

// Base URL (adjust as needed)
const BASE_URL = 'http://localhost:5000/api';

console.log('GlowSkin API Endpoints:');
console.log('======================');

console.log('\nAuthentication Routes:');
console.log('POST   ' + BASE_URL + '/auth/register');
console.log('POST   ' + BASE_URL + '/auth/login');
console.log('GET    ' + BASE_URL + '/auth/me');
console.log('PUT    ' + BASE_URL + '/auth/profile');
console.log('POST   ' + BASE_URL + '/auth/change-password');

console.log('\nUser Management Routes (Admin):');
console.log('GET    ' + BASE_URL + '/users');
console.log('GET    ' + BASE_URL + '/users/stats');
console.log('GET    ' + BASE_URL + '/users/:id');
console.log('POST   ' + BASE_URL + '/users');
console.log('PUT    ' + BASE_URL + '/users/:id');
console.log('DELETE ' + BASE_URL + '/users/:id');

console.log('\nProduct Routes:');
console.log('GET    ' + BASE_URL + '/products');
console.log('GET    ' + BASE_URL + '/products/categories');
console.log('GET    ' + BASE_URL + '/products/featured');
console.log('GET    ' + BASE_URL + '/products/stats (Admin)');
console.log('GET    ' + BASE_URL + '/products/:id');
console.log('POST   ' + BASE_URL + '/products (Admin)');
console.log('PUT    ' + BASE_URL + '/products/:id (Admin)');
console.log('PUT    ' + BASE_URL + '/products/:id/stock (Admin)');
console.log('DELETE ' + BASE_URL + '/products/:id (Admin)');

console.log('\nOrder Routes:');
console.log('POST   ' + BASE_URL + '/orders');
console.log('GET    ' + BASE_URL + '/orders');
console.log('GET    ' + BASE_URL + '/orders/stats (Admin)');
console.log('GET    ' + BASE_URL + '/orders/:id');
console.log('PUT    ' + BASE_URL + '/orders/:id/status (Admin)');
console.log('PUT    ' + BASE_URL + '/orders/:id/cancel');

console.log('\nFeedback Routes:');
console.log('POST   ' + BASE_URL + '/feedback');
console.log('GET    ' + BASE_URL + '/feedback');
console.log('GET    ' + BASE_URL + '/feedback/stats (Admin)');
console.log('GET    ' + BASE_URL + '/feedback/:id (Admin)');
console.log('PUT    ' + BASE_URL + '/feedback/:id/status (Admin)');
console.log('PUT    ' + BASE_URL + '/feedback/:id/reply (Admin)');
console.log('DELETE ' + BASE_URL + '/feedback/:id (Admin)');

console.log('\nUpload Routes (Admin):');
console.log('POST   ' + BASE_URL + '/uploads/single');
console.log('POST   ' + BASE_URL + '/uploads/multiple');
console.log('DELETE ' + BASE_URL + '/uploads/:publicId');
console.log('GET    ' + BASE_URL + '/uploads/stats');

console.log('\nExample Test Requests:');
console.log('=====================');

console.log(`
// Register a new user
fetch('${BASE_URL}/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+94771234567',
    address: {
      street: '123 Main St',
      city: 'Colombo',
      postalCode: '10100',
      country: 'Sri Lanka'
    }
  })
});

// Login
fetch('${BASE_URL}/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

// Get products
fetch('${BASE_URL}/products?page=1&limit=12');

// Get product by ID
fetch('${BASE_URL}/products/PRODUCT_ID');
`);

module.exports = {
  BASE_URL,
  endpoints: {
    auth: {
      register: BASE_URL + '/auth/register',
      login: BASE_URL + '/auth/login',
      me: BASE_URL + '/auth/me',
      profile: BASE_URL + '/auth/profile',
      changePassword: BASE_URL + '/auth/change-password'
    },
    users: {
      getAll: BASE_URL + '/users',
      stats: BASE_URL + '/users/stats',
      getById: (id) => BASE_URL + '/users/' + id,
      create: BASE_URL + '/users',
      update: (id) => BASE_URL + '/users/' + id,
      delete: (id) => BASE_URL + '/users/' + id
    },
    products: {
      getAll: BASE_URL + '/products',
      categories: BASE_URL + '/products/categories',
      featured: BASE_URL + '/products/featured',
      stats: BASE_URL + '/products/stats',
      getById: (id) => BASE_URL + '/products/' + id,
      create: BASE_URL + '/products',
      update: (id) => BASE_URL + '/products/' + id,
      updateStock: (id) => BASE_URL + '/products/' + id + '/stock',
      delete: (id) => BASE_URL + '/products/' + id
    },
    orders: {
      create: BASE_URL + '/orders',
      getAll: BASE_URL + '/orders',
      stats: BASE_URL + '/orders/stats',
      getById: (id) => BASE_URL + '/orders/' + id,
      updateStatus: (id) => BASE_URL + '/orders/' + id + '/status',
      cancel: (id) => BASE_URL + '/orders/' + id + '/cancel'
    },
    feedback: {
      submit: BASE_URL + '/feedback',
      getAll: BASE_URL + '/feedback',
      stats: BASE_URL + '/feedback/stats',
      getById: (id) => BASE_URL + '/feedback/' + id,
      updateStatus: (id) => BASE_URL + '/feedback/' + id + '/status',
      reply: (id) => BASE_URL + '/feedback/' + id + '/reply',
      delete: (id) => BASE_URL + '/feedback/' + id
    },
    uploads: {
      single: BASE_URL + '/uploads/single',
      multiple: BASE_URL + '/uploads/multiple',
      delete: (publicId) => BASE_URL + '/uploads/' + publicId,
      stats: BASE_URL + '/uploads/stats'
    }
  }
};
