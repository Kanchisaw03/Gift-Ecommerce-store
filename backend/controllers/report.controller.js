const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Report = require('../models/report.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find({ createdBy: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private/Admin
exports.getReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns report
  if (report.createdBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to access this report', 403)
    );
  }

  res.status(200).json({
    success: true,
    data: report
  });
});

// @desc    Create report
// @route   POST /api/reports
// @access  Private/Admin
exports.createReport = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const report = await Report.create(req.body);

  // Process report asynchronously
  processReport(report);

  res.status(201).json({
    success: true,
    data: report
  });
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns report
  if (report.createdBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to delete this report', 403)
    );
  }

  // Delete report file if exists
  if (report.fileUrl) {
    const filePath = path.join(__dirname, '..', 'public', report.fileUrl.replace(/^\//, ''));
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await report.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private/Admin
exports.downloadReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(
      new ErrorResponse(`Report not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns report
  if (report.createdBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to access this report', 403)
    );
  }

  // Check if report is completed
  if (report.status !== 'completed') {
    return next(
      new ErrorResponse(`Report is not ready for download (status: ${report.status})`, 400)
    );
  }

  // Check if file exists
  if (!report.fileUrl) {
    return next(
      new ErrorResponse('Report file not found', 404)
    );
  }

  const filePath = path.join(__dirname, '..', 'public', report.fileUrl.replace(/^\//, ''));
  
  if (!fs.existsSync(filePath)) {
    return next(
      new ErrorResponse('Report file not found', 404)
    );
  }

  // Set content type based on format
  let contentType;
  switch (report.format) {
    case 'csv':
      contentType = 'text/csv';
      break;
    case 'pdf':
      contentType = 'application/pdf';
      break;
    case 'json':
      contentType = 'application/json';
      break;
    default:
      contentType = 'application/octet-stream';
  }

  // Set headers
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename=${report.name.replace(/\s+/g, '_')}.${report.format}`);

  // Stream file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Process report asynchronously
const processReport = async (report) => {
  try {
    // Update report status to processing
    report.status = 'processing';
    await report.save();

    // Get report data based on type
    let data;
    switch (report.type) {
      case 'sales':
        data = await getSalesReportData(report);
        break;
      case 'products':
        data = await getProductsReportData(report);
        break;
      case 'users':
        data = await getUsersReportData(report);
        break;
      case 'inventory':
        data = await getInventoryReportData(report);
        break;
      default:
        throw new Error(`Unsupported report type: ${report.type}`);
    }

    // Generate report file
    const fileUrl = await generateReportFile(report, data);

    // Update report with file URL and status
    report.fileUrl = fileUrl;
    report.status = 'completed';
    report.completedAt = Date.now();
    await report.save();
  } catch (error) {
    console.error(`Error processing report ${report._id}:`, error);

    // Update report status to failed
    report.status = 'failed';
    await report.save();
  }
};

// Get sales report data
const getSalesReportData = async (report) => {
  const { dateRange, filters } = report;
  
  // Build query
  const query = {};
  
  // Add date range if provided
  if (dateRange && dateRange.startDate) {
    query.createdAt = { $gte: dateRange.startDate };
    
    if (dateRange.endDate) {
      query.createdAt.$lte = dateRange.endDate;
    }
  }
  
  // Add payment status filter
  if (filters && filters.paymentStatus) {
    query['paymentInfo.status'] = filters.paymentStatus;
  }
  
  // Add order status filter
  if (filters && filters.orderStatus) {
    query.status = filters.orderStatus;
  }
  
  // Get orders
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  // Transform orders for report
  return orders.map(order => ({
    orderId: order._id,
    orderNumber: order.orderNumber,
    customer: order.user ? order.user.name : 'Guest',
    email: order.user ? order.user.email : order.shippingAddress.email,
    date: order.createdAt,
    status: order.status,
    paymentStatus: order.paymentInfo.status,
    paymentMethod: order.paymentInfo.method,
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shippingCost,
    discount: order.coupon ? order.coupon.discountAmount : 0,
    total: order.total,
    items: order.items.length
  }));
};

// Get products report data
const getProductsReportData = async (report) => {
  const { dateRange, filters } = report;
  
  // Build query
  const query = {};
  
  // Add date range if provided
  if (dateRange && dateRange.startDate) {
    query.createdAt = { $gte: dateRange.startDate };
    
    if (dateRange.endDate) {
      query.createdAt.$lte = dateRange.endDate;
    }
  }
  
  // Add status filter
  if (filters && filters.status) {
    query.status = filters.status;
  }
  
  // Add category filter
  if (filters && filters.category) {
    query.category = filters.category;
  }
  
  // Add seller filter
  if (filters && filters.seller) {
    query.seller = filters.seller;
  }
  
  // Get products
  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('seller', 'name sellerInfo.businessName')
    .sort({ createdAt: -1 });
  
  // Transform products for report
  return products.map(product => ({
    productId: product._id,
    name: product.name,
    sku: product.sku,
    category: product.category ? product.category.name : 'Uncategorized',
    seller: product.seller ? (product.seller.sellerInfo.businessName || product.seller.name) : 'Admin',
    price: product.price,
    stock: product.stock,
    status: product.status,
    featured: product.featured,
    rating: product.rating,
    numReviews: product.numReviews,
    createdAt: product.createdAt
  }));
};

// Get users report data
const getUsersReportData = async (report) => {
  const { dateRange, filters } = report;
  
  // Build query
  const query = {};
  
  // Add date range if provided
  if (dateRange && dateRange.startDate) {
    query.createdAt = { $gte: dateRange.startDate };
    
    if (dateRange.endDate) {
      query.createdAt.$lte = dateRange.endDate;
    }
  }
  
  // Add role filter
  if (filters && filters.role) {
    query.role = filters.role;
  }
  
  // Add active filter
  if (filters && filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  
  // Get users
  const users = await User.find(query).sort({ createdAt: -1 });
  
  // Transform users for report
  return users.map(user => ({
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  }));
};

// Get inventory report data
const getInventoryReportData = async (report) => {
  const { filters } = report;
  
  // Build query
  const query = {};
  
  // Add stock filter
  if (filters && filters.stockLevel) {
    switch (filters.stockLevel) {
      case 'out_of_stock':
        query.stock = 0;
        break;
      case 'low_stock':
        query.stock = { $gt: 0, $lte: 10 };
        break;
      case 'in_stock':
        query.stock = { $gt: 10 };
        break;
    }
  }
  
  // Add category filter
  if (filters && filters.category) {
    query.category = filters.category;
  }
  
  // Add seller filter
  if (filters && filters.seller) {
    query.seller = filters.seller;
  }
  
  // Get products
  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('seller', 'name sellerInfo.businessName')
    .sort({ stock: 1 });
  
  // Transform products for report
  return products.map(product => ({
    productId: product._id,
    name: product.name,
    sku: product.sku,
    category: product.category ? product.category.name : 'Uncategorized',
    seller: product.seller ? (product.seller.sellerInfo.businessName || product.seller.name) : 'Admin',
    price: product.price,
    stock: product.stock,
    status: product.status,
    stockStatus: product.stock === 0 ? 'Out of Stock' : (product.stock <= 10 ? 'Low Stock' : 'In Stock')
  }));
};

// Generate report file
const generateReportFile = async (report, data) => {
  // Create directory if it doesn't exist
  const dirPath = path.join(__dirname, '..', 'public', 'reports');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Generate filename
  const timestamp = Date.now();
  const filename = `${report.type}_${timestamp}.${report.format}`;
  const filePath = path.join(dirPath, filename);
  
  // Generate file based on format
  switch (report.format) {
    case 'csv':
      await generateCsvFile(data, filePath);
      break;
    case 'pdf':
      await generatePdfFile(report, data, filePath);
      break;
    case 'json':
      await generateJsonFile(data, filePath);
      break;
    default:
      throw new Error(`Unsupported report format: ${report.format}`);
  }
  
  // Return file URL
  return `/reports/${filename}`;
};

// Generate CSV file
const generateCsvFile = async (data, filePath) => {
  if (data.length === 0) {
    // Create empty CSV with headers
    fs.writeFileSync(filePath, '');
    return;
  }
  
  // Get fields from first data item
  const fields = Object.keys(data[0]);
  
  // Create parser
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  
  // Write to file
  fs.writeFileSync(filePath, csv);
};

// Generate PDF file
const generatePdfFile = async (report, data, filePath) => {
  // Create PDF document
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  
  // Pipe PDF to file
  doc.pipe(stream);
  
  // Add title
  doc.fontSize(18).text(report.name, { align: 'center' });
  doc.moveDown();
  
  // Add report info
  doc.fontSize(12).text(`Report Type: ${report.type}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  
  if (report.dateRange && report.dateRange.startDate) {
    const startDate = new Date(report.dateRange.startDate).toLocaleDateString();
    const endDate = report.dateRange.endDate 
      ? new Date(report.dateRange.endDate).toLocaleDateString()
      : 'Present';
    
    doc.text(`Date Range: ${startDate} to ${endDate}`);
  }
  
  doc.moveDown();
  
  // Add table header
  if (data.length > 0) {
    const fields = Object.keys(data[0]);
    let xPos = 50;
    const colWidth = (doc.page.width - 100) / fields.length;
    
    // Draw header
    doc.fontSize(10).font('Helvetica-Bold');
    fields.forEach(field => {
      doc.text(field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), xPos, doc.y, {
        width: colWidth,
        align: 'left'
      });
      xPos += colWidth;
    });
    
    doc.moveDown();
    doc.font('Helvetica');
    
    // Draw rows
    data.slice(0, 50).forEach(row => {
      xPos = 50;
      const yPos = doc.y;
      
      fields.forEach(field => {
        let value = row[field];
        
        // Format value
        if (value instanceof Date) {
          value = value.toLocaleDateString();
        } else if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        } else if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        
        doc.text(String(value || ''), xPos, yPos, {
          width: colWidth,
          align: 'left'
        });
        
        xPos += colWidth;
      });
      
      doc.moveDown();
    });
    
    // Add note if data was truncated
    if (data.length > 50) {
      doc.moveDown();
      doc.text(`Note: This report has been truncated to show only the first 50 of ${data.length} records.`, {
        align: 'center',
        italic: true
      });
    }
  } else {
    doc.text('No data available for this report.', { align: 'center' });
  }
  
  // Finalize PDF
  doc.end();
  
  // Wait for stream to finish
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
};

// Generate JSON file
const generateJsonFile = async (data, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
