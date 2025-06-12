const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['feedback', 'inquiry', 'complaint', 'suggestion'],
    default: 'feedback'
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: [
      'Product Quality',
      'Delivery',
      'Customer Service',
      'Website Issues',
      'Payment',
      'Returns/Refunds',
      'General',
      'Other'
    ],
    default: 'General'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: function(value) {
        return this.type === 'feedback' ? value != null : true;
      },
      message: 'Rating is required for feedback'
    }
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  attachments: [{
    url: String,
    filename: String,
    fileType: String
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ priority: 1 });

// Virtual for response time in hours
feedbackSchema.virtual('responseTime').get(function() {
  if (this.adminResponse && this.adminResponse.respondedAt) {
    return Math.floor((this.adminResponse.respondedAt - this.createdAt) / (1000 * 60 * 60));
  }
  return null;
});

// Method to add admin response
feedbackSchema.methods.addResponse = function(message, adminUser) {
  this.adminResponse = {
    message: message,
    respondedBy: adminUser,
    respondedAt: new Date()
  };
  
  if (this.status === 'open') {
    this.status = 'in_progress';
  }
};

feedbackSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
