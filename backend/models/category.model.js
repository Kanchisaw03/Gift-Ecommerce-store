const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  image: {
    public_id: {
      type: String
    },
    url: {
      type: String
    }
  },
  icon: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  showInMenu: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  
  next();
});

// Update the updatedAt field on save
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

// Virtual for products in this category
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);
