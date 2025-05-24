const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide product']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide review content'],
    trim: true,
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  },
  images: [{
    public_id: {
      type: String
    },
    url: {
      type: String
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  sellerResponse: {
    content: String,
    createdAt: Date
  },
  rejectionReason: {
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

// Prevent user from submitting more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update the updatedAt field on save
ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get average rating of a product
ReviewSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId, status: 'approved' }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.model('Product').findByIdAndUpdate(productId, {
        rating: obj[0].averageRating.toFixed(1),
        numReviews: obj[0].numReviews
      });
    } else {
      await this.model('Product').findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.product);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
