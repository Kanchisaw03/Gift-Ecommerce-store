const express = require('express');
const router = express.Router();

// Import controllers
const {
  submitContactForm,
  getContacts,
  getContact,
  updateContact,
  addNote,
  deleteContact,
  replyToContact
} = require('../controllers/contact.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Contact = require('../models/contact.model');

// Public routes
router.route('/')
  .post(submitContactForm);

// Admin routes
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.route('/')
  .get(
    advancedResults(Contact, [
      { path: 'user', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]),
    getContacts
  );

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

router.route('/:id/notes')
  .post(addNote);

router.route('/:id/reply')
  .post(replyToContact);

module.exports = router;
