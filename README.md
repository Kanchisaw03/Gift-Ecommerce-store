# Luxury E-Commerce Platform

![Luxury E-Commerce](https://via.placeholder.com/800x400?text=Luxury+E-Commerce+Platform)

A sophisticated, full-stack e-commerce platform designed for luxury products with a dark-themed, gold-accented UI. This platform supports multiple user roles (Buyer, Seller, Admin, Super Admin) with comprehensive features for each role.

## 🌟 Features

### For Buyers
- Elegant product browsing with advanced filtering
- Secure checkout process with Stripe integration
- Order tracking and history
- Product reviews and ratings
- Personalized wishlist and favorites
- Address book management

### For Sellers
- Comprehensive dashboard with sales analytics
- Product management (add, edit, delete)
- Order management and fulfillment
- Earnings tracking and reports
- Seller profile and settings

### For Admins
- User and seller management
- Product approval and moderation
- Order oversight and management
- Review moderation
- Platform analytics and reporting

### For Super Admins
- Admin user management
- Platform settings configuration
- Category management
- Audit logs and system monitoring
- Featured products management

## 🛠️ Technology Stack

### Frontend
- React 19 with Vite for fast development
- React Router v7 for navigation
- Tailwind CSS for styling
- Framer Motion for smooth animations
- React Toastify for notifications
- Axios for API requests
- Recoil for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication with refresh tokens
- Bcrypt for password hashing
- Cloudinary for image uploads
- Stripe for payment processing
- Swagger for API documentation

## 🎨 Design

The platform features a luxury-themed design with:
- Dark mode with gold accents (#D4AF37)
- Elegant typography (Playfair Display, Montserrat, Cormorant Garamond)
- Soft-glow UI elements
- Minimalistic and sophisticated interface
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance

### Installation

#### Frontend
```bash
# Navigate to frontend directory
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create `.env` files in both frontend and backend directories with the necessary environment variables. Examples are provided in `.env.example` files.

## 📁 Project Structure

### Frontend
```
src/
├── admin/         # Admin components and pages
├── auth/          # Authentication related components
├── buyer/         # Buyer specific pages
├── components/    # Shared UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── Pages/         # Main application pages
├── seller/        # Seller specific pages
├── services/      # API services
├── shared/        # Shared utilities and components
├── styles/        # Global styles
└── utils/         # Utility functions
```

### Backend
```
├── config/        # Configuration files
├── controllers/   # Request handlers
├── middleware/    # Express middleware
├── models/        # Mongoose models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
└── server.js      # Main server file
```

## 🔐 Authentication

The platform uses JWT for authentication with role-based access control. For development purposes, authentication guards can be temporarily disabled with TODO comments indicating where to re-enable them.

## 📝 API Documentation

API documentation is available at `/api/docs` when the backend server is running, powered by Swagger.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
