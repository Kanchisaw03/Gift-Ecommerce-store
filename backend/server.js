const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const cartRoutes = require('./routes/cart.routes');
const paymentRoutes = require('./routes/payment.routes');
const sellerRoutes = require('./routes/seller.routes');
const adminRoutes = require('./routes/admin.routes');
const superAdminRoutes = require('./routes/superAdmin.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes');
const couponRoutes = require('./routes/coupon.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const searchRoutes = require('./routes/search.routes');
const statsRoutes = require('./routes/stats.routes');
const addressRoutes = require('./routes/address.routes');
const settingRoutes = require('./routes/setting.routes');
const reportRoutes = require('./routes/report.routes');
const webhookRoutes = require('./routes/webhook.routes');
const contactRoutes = require('./routes/contact.routes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Luxury E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Luxury E-Commerce platform',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.luxuryecommerce.com' 
          : 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET || 'luxury-ecommerce-secret'));

// Store raw body for webhook signature verification
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    req.rawBody = Buffer.from([]);
    req.on('data', (chunk) => {
      req.rawBody = Buffer.concat([req.rawBody, chunk]);
    });
  }
  next();
});

// Production-ready CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Remove any trailing slashes from the frontend URL
const normalizedFrontendUrl = frontendUrl.replace(/\/$/, '');

// Setup CORS with proper origin handling
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin matches our frontend URL (with or without trailing slash)
    const originWithoutSlash = origin.replace(/\/$/, '');
    if (originWithoutSlash === normalizedFrontendUrl) {
      return callback(null, true);
    }
    
    // For development, also allow localhost with different ports
    if (process.env.NODE_ENV !== 'production' && 
        (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-User-Role'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Log CORS configuration
console.log('CORS configured with normalized frontend URL:', normalizedFrontendUrl);

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
app.options('*', cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Configure helmet with CORS-friendly settings
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'unsafe-none' },
  contentSecurityPolicy: false
}));
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve static files from the public directory
app.use(express.static('public'));

// Welcome page
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Luxury E-Commerce API',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Test auth route
app.get('/api/test-auth', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Auth test route is working',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Import and use the custom error handler middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
console.log('Starting server...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
console.log(`Port: ${PORT}`);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('API routes available at:');
  console.log(`- Auth: http://localhost:${PORT}/api/auth`);
  console.log(`- Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app; // For testing purposes
