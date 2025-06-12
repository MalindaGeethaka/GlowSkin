const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { sendSuccess, sendError, getPaginationData } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');

// Submit feedback/inquiry
const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;
    
    const feedback = new Feedback({
      userId: req.user ? req.user.id : null,
      name,
      email,
      subject,
      message,
      type: type || 'inquiry'
    });

    await feedback.save();

    // Send confirmation email to user
    try {
      await sendEmail(
        email,
        'Thank you for contacting GlowSkin',
        `Dear ${name}, thank you for your ${type || 'inquiry'}. We have received your message and will get back to you soon.`
      );
    } catch (emailError) {
      console.error('Feedback confirmation email failed:', emailError);
    }

    // Send notification email to admin (if configured)
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail(
          adminEmail,
          `New ${type || 'inquiry'} from GlowSkin`,
          `New ${type || 'inquiry'} received from ${name} (${email})\n\nSubject: ${subject}\n\nMessage: ${message}`
        );
      }
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
    }

    sendSuccess(res, 'Feedback submitted successfully', feedback, 201);
  } catch (error) {
    console.error('Submit feedback error:', error);
    sendError(res, 'Server error submitting feedback', 500);
  }
};

// Get all feedback (Admin only)
const getAllFeedback = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status, 
      startDate, 
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const { skip, totalPages, totalItems } = await getPaginationData(Feedback, filter, page, limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const feedback = await Feedback.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email');

    sendSuccess(res, 'Feedback retrieved successfully', {
      feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    sendError(res, 'Server error retrieving feedback', 500);
  }
};

// Get feedback by ID (Admin only)
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findById(id)
      .populate('userId', 'firstName lastName email');
    
    if (!feedback) {
      return sendError(res, 'Feedback not found', 404);
    }

    sendSuccess(res, 'Feedback retrieved successfully', feedback);
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    sendError(res, 'Server error retrieving feedback', 500);
  }
};

// Update feedback status (Admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return sendError(res, 'Feedback not found', 404);
    }

    feedback.status = status;
    if (adminNotes) feedback.adminNotes = adminNotes;
    feedback.respondedAt = new Date();

    await feedback.save();

    sendSuccess(res, 'Feedback status updated successfully', feedback);
  } catch (error) {
    console.error('Update feedback status error:', error);
    sendError(res, 'Server error updating feedback status', 500);
  }
};

// Reply to feedback (Admin only)
const replyToFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return sendError(res, 'Feedback not found', 404);
    }

    feedback.reply = reply;
    feedback.status = 'responded';
    feedback.respondedAt = new Date();

    await feedback.save();

    // Send reply email to user
    try {
      await sendEmail(
        feedback.email,
        `Reply to your ${feedback.type} - GlowSkin`,
        `Dear ${feedback.name},\n\nThank you for contacting GlowSkin. Here is our response to your ${feedback.type}:\n\n${reply}\n\nBest regards,\nGlowSkin Team`
      );
    } catch (emailError) {
      console.error('Reply email failed:', emailError);
    }

    sendSuccess(res, 'Reply sent successfully', feedback);
  } catch (error) {
    console.error('Reply to feedback error:', error);
    sendError(res, 'Server error sending reply', 500);
  }
};

// Delete feedback (Admin only)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return sendError(res, 'Feedback not found', 404);
    }

    await Feedback.findByIdAndDelete(id);

    sendSuccess(res, 'Feedback deleted successfully');
  } catch (error) {
    console.error('Delete feedback error:', error);
    sendError(res, 'Server error deleting feedback', 500);
  }
};

// Get user's feedback
const getUserFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    const filter = { userId: req.user.id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const { skip, totalPages, totalItems } = await getPaginationData(Feedback, filter, page, limit);
    
    const feedback = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    sendSuccess(res, 'User feedback retrieved successfully', {
      feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    sendError(res, 'Server error retrieving user feedback', 500);
  }
};

// Get feedback statistics (Admin only)
const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
    const respondedFeedback = await Feedback.countDocuments({ status: 'responded' });
    
    // Feedback by type
    const feedbackByType = await Feedback.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent feedback (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Average response time for responded feedback
    const responseTimeStats = await Feedback.aggregate([
      {
        $match: { 
          status: 'responded',
          respondedAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$respondedAt', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    const avgResponseTime = responseTimeStats[0]?.avgResponseTime || 0;

    sendSuccess(res, 'Feedback statistics retrieved successfully', {
      totalFeedback,
      pendingFeedback,
      respondedFeedback,
      feedbackByType,
      recentFeedback,
      avgResponseTimeDays: Math.round(avgResponseTime * 100) / 100
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    sendError(res, 'Server error retrieving feedback statistics', 500);
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  replyToFeedback,
  deleteFeedback,
  getUserFeedback,
  getFeedbackStats
};
