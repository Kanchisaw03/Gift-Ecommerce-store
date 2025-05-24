const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  },
  addressType: {
    type: String,
    enum: ['shipping', 'billing', 'both'],
    default: 'both'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  apartment: {
    type: String,
    trim: true,
    maxlength: [100, 'Apartment cannot be more than 100 characters']
  },
  city: {
    type: String,
    required: [true, 'Please provide city'],
    trim: true,
    maxlength: [100, 'City cannot be more than 100 characters']
  },
  state: {
    type: String,
    required: [true, 'Please provide state'],
    trim: true,
    maxlength: [100, 'State cannot be more than 100 characters']
  },
  zipCode: {
    type: String,
    required: [true, 'Please provide zip code'],
    trim: true,
    maxlength: [20, 'Zip code cannot be more than 20 characters']
  },
  country: {
    type: String,
    required: [true, 'Please provide country'],
    trim: true,
    maxlength: [100, 'Country cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [200, 'Additional info cannot be more than 200 characters']
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
AddressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// If address is set as default, unset any other default addresses for the same user and type
AddressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    try {
      // Find all other addresses for this user with the same addressType and set isDefault to false
      await this.constructor.updateMany(
        { 
          user: this.user, 
          _id: { $ne: this._id },
          $or: [
            { addressType: this.addressType },
            { addressType: 'both' }
          ]
        },
        { isDefault: false }
      );
    } catch (err) {
      console.error('Error updating default addresses:', err);
    }
  }
  next();
});

module.exports = mongoose.model('Address', AddressSchema);
