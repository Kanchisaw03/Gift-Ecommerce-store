const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be greater than 0']
  },
  salePrice: {
    type: Number,
    default: 0
  },
  onSale: {
    type: Boolean,
    default: false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a seller']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  shippingInfo: {
    weight: {
      type: Number,
      default: 0
    },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    shippingTime: {
      type: String,
      default: '3-5'
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
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

// Create slug from name before saving
ProductSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  
  // Add a random string to ensure uniqueness
  if (!this.isModified('name')) {
    return next();
  }
  
  this.slug = `${this.slug}-${Math.random().toString(36).substring(2, 8)}`;
  next();
});

// Update the updatedAt field on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for product reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

// Calculate average rating when reviews are populated
ProductSchema.methods.calculateAverageRating = function(reviews) {
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / reviews.length).toFixed(1);
    this.numReviews = reviews.length;
  } else {
    this.rating = 0;
    this.numReviews = 0;
  }
  return this.save();
};

// Get final price (considering sale price if on sale)
ProductSchema.virtual('finalPrice').get(function() {
  return this.onSale && this.salePrice > 0 ? this.salePrice : this.price;
});

// Check if product is in stock
ProductSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

module.exports = mongoose.model('Product', ProductSchema);
