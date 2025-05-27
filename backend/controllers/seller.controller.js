const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private (Seller)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get seller products count
  const totalProducts = await Product.countDocuments({ seller: req.user.id });
  
  // Get pending products count
  const pendingProducts = await Product.countDocuments({ 
    seller: req.user.id,
    status: 'pending'
  });
  
  // Get seller orders
  const orders = await Order.find({ 'items.seller': req.user.id });
  
  // Calculate total orders
  const totalOrders = orders.length;
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count items that belong to this seller
    const sellerItems = order.items.filter(
      item => item.seller.toString() === req.user.id
    );
    
    return sum + sellerItems.reduce(
      (itemSum, item) => itemSum + (item.price * item.quantity),
      0
    );
  }, 0);
  
  // Calculate pending orders
  const pendingOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'processing'
  ).length;
  
  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
  
  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      pendingProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    }
  });
});

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private (Seller)
exports.getSellerOrders = asyncHandler(async (req, res, next) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Filter by status if provided
  const filter = { 'items.seller': req.user.id };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  // Get total count
  const total = await Order.countDocuments(filter);
  
  // Get orders
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('user', 'name email')
    .populate('items.product', 'name images price');
  
  // Process orders to include only items belonging to this seller
  const sellerOrders = orders.map(order => {
    // Create a copy of the order document
    const orderObj = order.toObject();
    
    // Filter items to only include those belonging to this seller
    orderObj.items = orderObj.items.filter(
      item => item.seller && item.seller.toString() === req.user.id
    );
    
    // Calculate total for seller items
    orderObj.sellerTotal = orderObj.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    return orderObj;
  });
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  pagination.pages = Math.ceil(total / limit);
  pagination.page = page;
  pagination.limit = limit;
  pagination.total = total;
  
  res.status(200).json({
    success: true,
    count: sellerOrders.length,
    pagination,
    data: sellerOrders
  });
});

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private (Seller)
exports.getSellerProducts = asyncHandler(async (req, res, next) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Filter by status if provided
  const filter = { seller: req.user.id };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  // Get total count
  const total = await Product.countDocuments(filter);
  
  // Get products
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('category', 'name');
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    total,
    data: products
  });
});

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private (Seller)
exports.getSellerOrders = asyncHandler(async (req, res, next) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Find orders that contain items from this seller
  const orders = await Order.find({ 'items.seller': req.user.id })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('user', 'name email');
  
  // Filter orders to only include items from this seller
  const filteredOrders = orders.map(order => {
    const sellerItems = order.items.filter(
      item => item.seller.toString() === req.user.id
    );
    
    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.user,
      items: sellerItems,
      status: order.status,
      totalAmount: sellerItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      ),
      createdAt: order.createdAt
    };
  });
  
  // Get total count
  const total = await Order.countDocuments({ 'items.seller': req.user.id });
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  // Calculate pagination pages
  pagination.pages = Math.ceil(total / limit);
  pagination.page = page;
  pagination.limit = limit;
  pagination.total = total;

  console.log('Sending seller orders response:', {
    success: true,
    count: filteredOrders.length,
    pagination,
    data: filteredOrders
  });

  res.status(200).json({
    success: true,
    count: filteredOrders.length,
    pagination,
    data: filteredOrders
  });
});

// @desc    Get seller analytics
// @route   GET /api/seller/analytics
// @access  Private (Seller)
exports.getSellerAnalytics = asyncHandler(async (req, res, next) => {
  const { period } = req.query;
  let dateFilter = {};
  const now = new Date();
  
  // Set date filter based on period
  if (period === 'week') {
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: lastWeek } };
  } else if (period === 'month') {
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: lastMonth } };
  } else if (period === 'year') {
    const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: lastYear } };
  }
  
  // Get orders for the period
  const orders = await Order.find({
    'items.seller': req.user.id,
    ...dateFilter
  });
  
  // Calculate sales by date
  const salesByDate = {};
  
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    
    if (!salesByDate[date]) {
      salesByDate[date] = 0;
    }
    
    // Only count items from this seller
    const sellerItems = order.items.filter(
      item => item.seller.toString() === req.user.id
    );
    
    salesByDate[date] += sellerItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  });
  
  // Convert to array for chart data
  const salesData = Object.keys(salesByDate).map(date => ({
    date,
    amount: salesByDate[date]
  }));
  
  // Sort by date
  salesData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  res.status(200).json({
    success: true,
    data: salesData
  });
});

// @desc    Get seller earnings
// @route   GET /api/seller/earnings
// @access  Private (Seller)
exports.getSellerEarnings = asyncHandler(async (req, res, next) => {
  // Get seller info
  const seller = await User.findById(req.user.id)
    .select('sellerInfo');
  
  // Get all completed orders
  const orders = await Order.find({
    'items.seller': req.user.id,
    status: 'completed'
  });
  
  // Calculate total earnings
  let totalEarnings = 0;
  let pendingPayouts = 0;
  
  orders.forEach(order => {
    // Only count items from this seller
    const sellerItems = order.items.filter(
      item => item.seller.toString() === req.user.id
    );
    
    const orderTotal = sellerItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Apply commission
    const commission = seller.sellerInfo.commission || 5; // Default 5%
    const earnings = orderTotal * (1 - commission / 100);
    
    totalEarnings += earnings;
    
    // If payment is not processed yet, add to pending
    if (!order.sellerPaid) {
      pendingPayouts += earnings;
    }
  });
  
  // Get earnings by month for the last 6 months
  const earningsByMonth = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${months[month.getMonth()]} ${month.getFullYear()}`;
    earningsByMonth[monthKey] = 0;
  }
  
  // Calculate earnings for each month
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const monthKey = `${months[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
    
    // Only count if within last 6 months
    if (earningsByMonth[monthKey] !== undefined) {
      // Only count items from this seller
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user.id
      );
      
      const orderTotal = sellerItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
      
      // Apply commission
      const commission = seller.sellerInfo.commission || 5; // Default 5%
      const earnings = orderTotal * (1 - commission / 100);
      
      earningsByMonth[monthKey] += earnings;
    }
  });
  
  // Convert to array for chart data
  const monthlyEarnings = Object.keys(earningsByMonth).map(month => ({
    month,
    amount: earningsByMonth[month]
  }));
  
  res.status(200).json({
    success: true,
    data: {
      totalEarnings,
      pendingPayouts,
      commission: seller.sellerInfo.commission || 5,
      monthlyEarnings
    }
  });
});

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private (Seller)
exports.updateSellerProfile = asyncHandler(async (req, res, next) => {
  const {
    businessName,
    businessAddress,
    businessDescription,
    taxId,
    paymentDetails
  } = req.body;
  
  // Find seller
  const seller = await User.findById(req.user.id);
  
  if (!seller) {
    return next(new ErrorResponse('Seller not found', 404));
  }
  
  // Update seller info
  if (businessName) seller.sellerInfo.businessName = businessName;
  if (businessAddress) seller.sellerInfo.businessAddress = businessAddress;
  if (businessDescription) seller.sellerInfo.businessDescription = businessDescription;
  if (taxId) seller.sellerInfo.taxId = taxId;
  
  // Update payment details if provided
  if (paymentDetails) {
    if (paymentDetails.accountHolder) {
      seller.sellerInfo.paymentDetails.accountHolder = paymentDetails.accountHolder;
    }
    if (paymentDetails.accountNumber) {
      seller.sellerInfo.paymentDetails.accountNumber = paymentDetails.accountNumber;
    }
    if (paymentDetails.bankName) {
      seller.sellerInfo.paymentDetails.bankName = paymentDetails.bankName;
    }
    if (paymentDetails.swiftCode) {
      seller.sellerInfo.paymentDetails.swiftCode = paymentDetails.swiftCode;
    }
  }
  
  await seller.save();
  
  res.status(200).json({
    success: true,
    data: seller.sellerInfo
  });
});

// Add a base route handler for /api/seller
exports.getSellerInfo = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Seller API is working',
    endpoints: [
      { method: 'GET', path: '/dashboard', description: 'Get seller dashboard statistics' },
      { method: 'GET', path: '/products', description: 'Get seller products' },
      { method: 'GET', path: '/orders', description: 'Get orders for seller products' },
      { method: 'GET', path: '/analytics', description: 'Get seller sales analytics' },
      { method: 'GET', path: '/earnings', description: 'Get seller earnings information' },
      { method: 'PUT', path: '/profile', description: 'Update seller profile information' }
    ]
  });
});
