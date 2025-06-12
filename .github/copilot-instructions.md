# Copilot Instructions for GlowSkin E-commerce Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack e-commerce platform called "GlowSkin" focused on skincare products for customers in Sri Lanka and beyond.

## Tech Stack
- **Frontend**: React.js with TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT-based (with bcrypt for password hashing)
- **Image Upload**: Cloudinary
- **Email Service**: Nodemailer (for order confirmations)

## Project Structure
- `/client` - React TypeScript frontend
- `/server` - Node.js Express backend

## User Roles
- **Admin**: Manage users, products, orders, view reports
- **Customer**: Register/login, browse products, place orders, view order history
- **Guest**: Browse products, view details (prompted to register for purchases)

## Key Features to Implement
- User authentication and authorization
- Product management (CRUD)
- Shopping cart functionality
- Order management system
- Admin dashboard with reports
- Feedback/inquiry system
- Image upload for products
- Email notifications

## MongoDB Collections
- `users` (role: admin | customer)
- `products` (title, description, price, stock, category, images, skin type)
- `orders` (userId, items, totalPrice, status: pending | shipped | delivered)
- `feedback` (userId, message, timestamp)

## Development Guidelines
- Use TypeScript for type safety
- Follow React best practices with hooks
- Implement proper error handling
- Use JWT for authentication
- Implement role-based access control
- Use Tailwind CSS for styling
- Follow RESTful API conventions
- Implement proper validation (client and server)
