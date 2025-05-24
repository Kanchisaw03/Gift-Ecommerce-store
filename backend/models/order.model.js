const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  billingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentInfo: {
    id: {
      type: String
    },
    method: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'stripe', 'bank_transfer']
    },
    status: {
      type: String,
      default: 'pending'
    },
    paidAt: {
      type: Date
    }
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  tax: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0.0
  },
  discount: {
    type: Number,
    default: 0.0
  },
  couponCode: {
    type: String
  },
  total: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  notes: {
    type: String
  },
  trackingNumber: {
    type: String
  },
  carrier: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  refundedAt: {
    type: Date
  },
  refundAmount: {
    type: Number
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    // Generate a unique order number with prefix 'LUX' followed by timestamp and random string
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `LUX${timestamp}${randomStr}`;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Calculate order totals before saving
OrderSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Calculate total (subtotal + tax + shipping - discount)
  this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
  
  next();
});

// Virtual for order timeline/history
OrderSchema.virtual('timeline', {
  ref: 'OrderTimeline',
  localField: '_id',
  foreignField: 'order',
  justOne: false
});

module.exports = mongoose.model('Order', OrderSchema);
