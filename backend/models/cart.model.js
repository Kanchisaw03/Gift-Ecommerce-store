const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      // For development mode - to handle mock products with non-ObjectId IDs
      mockId: {
        type: String
      }
    }
  ],
  couponCode: {
    type: String
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field on save
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate cart totals before saving
CartSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Calculate total (subtotal - discount)
  this.total = this.subtotal - this.couponDiscount;
  
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
