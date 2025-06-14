const Inquiry = require('../models/Inquiry');
const { sendSuccess, sendError, getPaginationData } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');

// Create a new inquiry
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, type, relatedOrder, relatedProduct } = req.body;

    const inquiry = new Inquiry({
      name,
      email,
      phone,
      subject,
      message,
      type: type || 'general',
      relatedOrder,
      relatedProduct
    });

    await inquiry.save();

    // Send confirmation email to customer
    try {
      await sendEmail(
        email,
        'We received your inquiry - GlowSkin',
        `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your inquiry and will get back to you within 24 hours.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Inquiry Details:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <p>If you need immediate assistance, please call us at +94 123 456 789.</p>
          <p>Best regards,<br>GlowSkin Customer Service Team</p>
        `
      );
    } catch (emailError) {
      console.error('Inquiry confirmation email failed:', emailError);
    }

    // Send notification to admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL || 'admin@glowskin.lk',
        'New Customer Inquiry - GlowSkin',
        `
          <h2>New Inquiry Received</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Please respond to this inquiry through the admin dashboard.</p>
        `
      );
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
    }

    sendSuccess(res, 'Inquiry submitted successfully', inquiry, 201);
  } catch (error) {
    console.error('Create inquiry error:', error);
    sendError(res, 'Server error creating inquiry', 500);
  }
};

// Get all inquiries (Admin only)
const getAllInquiries = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      type,
      priority,
      isRead,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const { skip, totalPages, totalItems } = await getPaginationData(Inquiry, filter, page, limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const inquiries = await Inquiry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('respondedBy', 'name')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedProduct', 'title');

    sendSuccess(res, 'Inquiries retrieved successfully', {
      inquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all inquiries error:', error);
    sendError(res, 'Server error retrieving inquiries', 500);
  }
};

// Get inquiry by ID
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id)
      .populate('respondedBy', 'name email')
      .populate('relatedOrder', 'orderNumber totalAmount')
      .populate('relatedProduct', 'title price');

    if (!inquiry) {
      return sendError(res, 'Inquiry not found', 404);
    }

    // Mark as read when viewed by admin
    if (!inquiry.isRead) {
      inquiry.isRead = true;
      await inquiry.save();
    }

    sendSuccess(res, 'Inquiry retrieved successfully', inquiry);
  } catch (error) {
    console.error('Get inquiry by ID error:', error);
    sendError(res, 'Server error retrieving inquiry', 500);
  }
};

// Update inquiry status and respond (Admin only)
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminResponse, tags } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return sendError(res, 'Inquiry not found', 404);
    }

    // Update fields
    if (status) inquiry.status = status;
    if (priority) inquiry.priority = priority;
    if (tags) inquiry.tags = tags;
    
    // Add admin response
    if (adminResponse) {
      inquiry.adminResponse = adminResponse;
      inquiry.respondedBy = req.user.id;
      inquiry.respondedAt = new Date();
      inquiry.status = 'in_progress';
    }

    inquiry.isRead = true;
    await inquiry.save();

    // Send response email to customer if there's a response
    if (adminResponse) {
      try {
        await sendEmail(
          inquiry.email,
          `Response to your inquiry - GlowSkin`,
          `
            <h2>Response to Your Inquiry</h2>
            <p>Dear ${inquiry.name},</p>
            <p>Thank you for contacting GlowSkin. Here's our response to your inquiry:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Original Inquiry:</h3>
              <p><strong>Subject:</strong> ${inquiry.subject}</p>
              <p><strong>Message:</strong> ${inquiry.message}</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Our Response:</h3>
              <p>${adminResponse}</p>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>GlowSkin Customer Service Team</p>
          `
        );
      } catch (emailError) {
        console.error('Response email failed:', emailError);
      }
    }

    sendSuccess(res, 'Inquiry updated successfully', inquiry);
  } catch (error) {
    console.error('Update inquiry error:', error);
    sendError(res, 'Server error updating inquiry', 500);
  }
};

// Delete inquiry (Admin only)
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return sendError(res, 'Inquiry not found', 404);
    }

    await Inquiry.findByIdAndDelete(id);

    sendSuccess(res, 'Inquiry deleted successfully');
  } catch (error) {
    console.error('Delete inquiry error:', error);
    sendError(res, 'Server error deleting inquiry', 500);
  }
};

// Get inquiry statistics (Admin only)
const getInquiryStats = async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
    const inProgressInquiries = await Inquiry.countDocuments({ status: 'in_progress' });
    const resolvedInquiries = await Inquiry.countDocuments({ status: 'resolved' });
    const unreadInquiries = await Inquiry.countDocuments({ isRead: false });

    // Inquiries by type
    const inquiriesByType = await Inquiry.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent inquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentInquiries = await Inquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Average response time (in hours)
    const responseTimeData = await Inquiry.aggregate([
      {
        $match: { 
          respondedAt: { $exists: true },
          createdAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$respondedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    const averageResponseTime = responseTimeData[0]?.averageResponseTime || 0;

    sendSuccess(res, 'Inquiry statistics retrieved successfully', {
      totalInquiries,
      pendingInquiries,
      inProgressInquiries,
      resolvedInquiries,
      unreadInquiries,
      inquiriesByType,
      recentInquiries,
      averageResponseTime: Math.round(averageResponseTime * 10) / 10 // Round to 1 decimal
    });
  } catch (error) {
    console.error('Get inquiry stats error:', error);
    sendError(res, 'Server error retrieving inquiry statistics', 500);
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiryStats
};
