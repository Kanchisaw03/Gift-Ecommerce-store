# Luxury E-Commerce Backend

A comprehensive backend API for a luxury e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Authentication, authorization, and user profiles for buyers, sellers, admins, and super admins
- **Product Management**: CRUD operations for products with categories, tags, and images
- **Order Processing**: Complete order lifecycle from cart to delivery
- **Payment Integration**: Stripe payment processing with webhooks
- **Reviews & Ratings**: Product review system with moderation
- **Analytics**: Comprehensive analytics for sellers and admins
- **Notifications**: Real-time notifications for users
- **Admin Dashboard**: Complete admin and super admin functionality
- **Seller Dashboard**: Seller management tools and analytics

## Tech Stack

- **Node.js & Express**: Server framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Cloudinary**: Image storage
- **Stripe**: Payment processing
- **Nodemailer**: Email notifications

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── services/         # Business logic services
├── utils/            # Utility functions
├── public/           # Public assets
├── tests/            # Test files
├── .env.example      # Environment variables example
├── package.json      # Dependencies
└── server.js         # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user orders
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/track` - Track order

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Seller
- `GET /api/seller/dashboard` - Get seller dashboard
- `GET /api/seller/products` - Get seller products
- `GET /api/seller/orders` - Get seller orders
- `GET /api/seller/earnings` - Get seller earnings
- `GET /api/seller/analytics` - Get seller analytics

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/products/:id/approve` - Approve product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/reviews` - Get all reviews

### Super Admin
- `GET /api/super-admin/dashboard` - Get super admin dashboard
- `GET /api/super-admin/admins` - Get all admins
- `POST /api/super-admin/admins` - Create admin
- `GET /api/super-admin/audit-logs` - Get audit logs
- `GET /api/super-admin/settings` - Get settings

## Development Mode

For development purposes, authentication and authorization have been temporarily disabled. This allows for easier testing of all endpoints without requiring authentication tokens.

To enable authentication:

1. Open `middleware/auth.js`
2. Set `DISABLE_AUTH` to `false`
3. Remove all TODO comments related to authentication

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure environment variables
4. Run the development server: `npm run dev`

## License

This project is proprietary and confidential.
