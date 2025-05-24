const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Contact = require('../models/contact.model');
const User = require('../models/user.model');
const sendEmail = require('../utils/sendEmail');
const SettingService = require('../services/setting.service');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message, phone, orderNumber, type } = req.body;

  // Create contact entry
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
    phone,
    orderNumber,
    type: type || 'general',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    user: req.user ? req.user.id : null
  });

  // Send notification email to admin
  try {
    const adminEmail = await SettingService.getValue('contact_email', 'admin@example.com');
    
    await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
        New contact form submission from ${name} (${email})
        
        Subject: ${subject}
        Type: ${type || 'General'}
        ${orderNumber ? `Order Number: ${orderNumber}` : ''}
        ${phone ? `Phone: ${phone}` : ''}
        
        Message:
        ${message}
        
        Submitted on: ${new Date().toLocaleString()}
      `
    });
  } catch (err) {
    console.error('Error sending admin notification email:', err);
    // Don't return error to client if email fails
  }

  // Send confirmation email to user
  try {
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting us',
      text: `
        Dear ${name},
        
        Thank you for contacting us. We have received your message and will respond to you as soon as possible.
        
        Your inquiry details:
        Subject: ${subject}
        ${orderNumber ? `Order Number: ${orderNumber}` : ''}
        
        We appreciate your patience and look forward to assisting you.
        
        Best regards,
        The Luxury E-Commerce Team
      `
    });
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    // Don't return error to client if email fails
  }

  res.status(201).json({
    success: true,
    data: contact
  });
});

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .populate('notes.createdBy', 'name');

  if (!contact) {
    return next(
      new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Update contact submission
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = asyncHandler(async (req, res, next) => {
  const { status, priority, assignedTo } = req.body;

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404)
    );
  }

  // Update fields
  if (status) contact.status = status;
  if (priority) contact.priority = priority;
  if (assignedTo) contact.assignedTo = assignedTo;

  // If status is changed to resolved, set resolvedAt
  if (status === 'resolved' && contact.status !== 'resolved') {
    contact.resolvedAt = Date.now();
  }

  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Add note to contact submission
// @route   POST /api/contact/:id/notes
// @access  Private/Admin
exports.addNote = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('Please provide note content', 400));
  }

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404)
    );
  }

  // Add note
  contact.notes.push({
    content,
    createdBy: req.user.id
  });

  await contact.save();

  // Populate user details in the new note
  const populatedContact = await Contact.findById(req.params.id)
    .populate('notes.createdBy', 'name');

  res.status(200).json({
    success: true,
    data: populatedContact
  });
});

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404)
    );
  }

  await contact.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reply to contact submission
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
exports.replyToContact = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorResponse('Please provide a reply message', 400));
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404)
    );
  }

  // Send reply email
  try {
    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      text: `
        Dear ${contact.name},
        
        Thank you for contacting us. Here is our response to your inquiry:
        
        ${message}
        
        If you have any further questions, please don't hesitate to contact us again.
        
        Best regards,
        The Luxury E-Commerce Team
      `
    });
  } catch (err) {
    return next(
      new ErrorResponse('Error sending reply email', 500)
    );
  }

  // Add note about the reply
  contact.notes.push({
    content: `Reply sent: ${message}`,
    createdBy: req.user.id
  });

  // Update status if not already resolved or closed
  if (contact.status === 'new' || contact.status === 'in_progress') {
    contact.status = 'resolved';
    contact.resolvedAt = Date.now();
  }

  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});
