const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: function() { return this.price; }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Cleansers',
      'Moisturizers', 
      'Serums',
      'Sunscreens',
      'Toners',
      'Face Masks',
      'Eye Care',
      'Treatments',
      'Body Care',
      'Lip Care'
    ]
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  skinType: [{
    type: String,
    enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal', 'All Types']
  }],
  ingredients: [String],
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    alt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  weight: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  usage: String,
  benefits: [String]
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ skinType: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= 5) return 'Low Stock';
  return 'In Stock';
});

// Update ratings when reviews change
productSchema.methods.updateRatings = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
};

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
