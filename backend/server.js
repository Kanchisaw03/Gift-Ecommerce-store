const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const http = require('http');
const socketio = require('socket.io');

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
const testRoutes = require('./routes/test.routes');
const aiRoutes = require('./routes/ai.routes');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log('Socket auth token received:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Socket connection rejected: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }
    
    // You can verify the token here if needed
    // For now, we'll just accept any token
    
    console.log('Socket authentication successful');
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Emit a welcome event to confirm connection
  socket.emit('welcome', { message: 'Connected to server successfully' });
  
  // Join room (e.g., for product details page)
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  
  // Leave room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
  });
  
  // Disconnect
  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
  });
  
  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

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

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  debug: false, // Disable debug mode to silence warnings
  uploadTimeout: 0, // No timeout
  createParentPath: true, // Create parent path if it doesn't exist
  safeFileNames: true, // Remove special characters from file names
  preserveExtension: true, // Preserve file extensions
  parseNested: true, // Parse nested objects in form data
}));

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
    
    // In development mode, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Check if origin matches our frontend URL (with or without trailing slash)
    const originWithoutSlash = origin.replace(/\/$/, '');
    if (originWithoutSlash === normalizedFrontendUrl) {
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

// Apply CORS middleware - configured for development with credentials
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost with any port
    if (process.env.NODE_ENV !== 'production' && 
        (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }
    
    // Check against the configured frontend URL
    if (origin === normalizedFrontendUrl) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-User-Role'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
}));

// Handle OPTIONS requests explicitly
app.options('*', function(req, res) {
  // Set CORS headers for preflight requests
  // Allows to request from any origin when credentials are not included
  if (!req.headers['access-control-request-headers']?.includes('authorization')) {
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    // For requests with credentials, set the specific origin
    const origin = req.headers.origin;
    if (origin && (origin.startsWith('http://localhost:') || 
                   origin.startsWith('http://127.0.0.1:') || 
                   origin === normalizedFrontendUrl)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-User-Role');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

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
  windowMs: process.env.NODE_ENV === 'development' ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit in development
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting only to auth routes in development to prevent login issues
if (process.env.NODE_ENV === 'development') {
  app.use('/api/auth/login', limiter); // Only limit login endpoint
} else {
  app.use('/api', limiter); // Limit all API endpoints in production
}

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
app.use('/api/test', testRoutes);
app.use('/api/ai', aiRoutes);

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

// Use the HTTP server with Socket.IO instead of Express server directly
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('API routes available at:');
  console.log(`- Auth: http://localhost:${PORT}/api/auth`);
  console.log(`- Health check: http://localhost:${PORT}/api/health`);
  console.log(`- Socket.IO enabled for real-time updates`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app; // For testing purposes
