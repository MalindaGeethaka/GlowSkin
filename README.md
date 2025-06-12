# GlowSkin E-commerce Platform

A modern, full-stack e-commerce platform for skincare products built with React, Node.js, and MongoDB.

## 🌟 Features

### For Customers
- **User Authentication**: Secure registration and login with JWT
- **Product Browsing**: Browse skincare products with advanced filtering
- **Shopping Cart**: Add/remove products, manage quantities
- **Order Management**: Place orders, track order status
- **User Profile**: Manage personal information and order history
- **Product Reviews**: Rate and review products

### For Administrators
- **Admin Dashboard**: Comprehensive analytics and reports
- **User Management**: View and manage customer accounts
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: Process orders, update statuses
- **Feedback Management**: View and respond to customer feedback
- **Analytics**: Sales reports, user statistics, product performance

### For Guests
- **Product Browsing**: View products and details without account
- **Search & Filter**: Find products by category, skin type, price
- **Product Information**: Detailed product descriptions and reviews

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **Axios** for API calls
- **React Query** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image uploads
- **Nodemailer** for email notifications
- **Express Validator** for input validation

### Security & Performance
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation and sanitization**
- **Password strength requirements**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-commerce-skincare
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

**Server Environment (.env in /server directory):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/glowskin

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Client Environment (.env in /client directory):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=GlowSkin
REACT_APP_VERSION=1.0.0
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

### 5. Cloudinary Setup (Optional for development)
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add them to your server .env file

### 6. Email Setup (Optional for development)
1. Use Gmail with App Password for development
2. Enable 2FA on your Gmail account
3. Generate an App Password
4. Use the App Password in EMAIL_PASSWORD

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Option 1: Run both servers simultaneously (from root directory)
npm run dev

# Option 2: Run servers separately
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api

### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/cancel` - Cancel order

### Upload Endpoints
- `POST /api/uploads/product` - Upload product images
- `POST /api/uploads/avatar` - Upload user avatar
- `DELETE /api/uploads/:publicId` - Delete uploaded file

## 🏗️ Project Structure

```
e-commerce-skincare/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── contexts/      # React contexts
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   └── package.json
├── .github/
│   └── copilot-instructions.md
├── package.json          # Root package.json
└── README.md
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Enable automatic deployments

### Vercel Deployment (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### MongoDB Atlas
1. Create a MongoDB Atlas cluster
2. Get the connection string
3. Update MONGODB_URI in your environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic authentication system
- [x] Product management
- [x] Order processing
- [x] Admin dashboard
- [x] Image uploads
- [x] Email notifications

### Phase 2 (Upcoming)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] PWA features

### Phase 3 (Future)
- [ ] AI-powered product recommendations
- [ ] Subscription service
- [ ] Loyalty program
- [ ] Social features
- [ ] Advanced inventory management

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Tailwind CSS for the utility-first CSS framework
- Cloudinary for image management
- All open-source contributors

---

Made with ❤️ for skincare enthusiasts in Sri Lanka and beyond.
