const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendSuccess, sendError, getPaginationData } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    
    // Validate and calculate total
    let totalPrice = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return sendError(res, `Product not found: ${item.productId}`, 404);
      }
      
      if (product.stock < item.quantity) {
        return sendError(res, `Insufficient stock for ${product.title}`, 400);
      }
      
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;
      
      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal
      });
    }

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      notes
    });

    await order.save();

    // Update product stocks
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Send order confirmation email
    try {
      const user = await User.findById(req.user.id);
      await sendEmail(
        user.email,
        'Order Confirmation - GlowSkin',
        `Thank you for your order! Order ID: ${order._id}. Total: LKR ${totalPrice.toFixed(2)}`
      );
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    sendSuccess(res, 'Order created successfully', order, 201);
  } catch (error) {
    console.error('Create order error:', error);
    sendError(res, 'Server error creating order', 500);
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const { skip, totalPages, totalItems } = await getPaginationData(Order, filter, page, limit);
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.productId', 'title images');

    sendSuccess(res, 'Orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    sendError(res, 'Server error retrieving orders', 500);
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'title images');
    
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    sendSuccess(res, 'Order retrieved successfully', order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    sendError(res, 'Server error retrieving order', 500);
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      userId, 
      startDate, 
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const { skip, totalPages, totalItems } = await getPaginationData(Order, filter, page, limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'title');

    sendSuccess(res, 'Orders retrieved successfully', {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    sendError(res, 'Server error retrieving orders', 500);
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(id).populate('userId', 'firstName lastName email');
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    const oldStatus = order.status;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    // Update timestamps based on status
    if (status === 'confirmed' && oldStatus === 'pending') {
      order.confirmedAt = new Date();
    } else if (status === 'shipped' && oldStatus !== 'shipped') {
      order.shippedAt = new Date();
    } else if (status === 'delivered' && oldStatus !== 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send status update email
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and is being prepared.',
        shipped: `Your order has been shipped${trackingNumber ? ` with tracking number: ${trackingNumber}` : ''}.`,
        delivered: 'Your order has been delivered. Thank you for shopping with GlowSkin!',
        cancelled: 'Your order has been cancelled.'
      };

      if (statusMessages[status]) {
        await sendEmail(
          order.userId.email,
          `Order Update - GlowSkin`,
          `Hello ${order.userId.firstName}, ${statusMessages[status]} Order ID: ${order._id}`
        );
      }
    } catch (emailError) {
      console.error('Order status email failed:', emailError);
    }

    sendSuccess(res, 'Order status updated successfully', order);
  } catch (error) {
    console.error('Update order status error:', error);
    sendError(res, 'Server error updating order status', 500);
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return sendError(res, 'Cannot cancel order in current status', 400);
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    if (reason) order.cancellationReason = reason;

    await order.save();

    // Restore product stocks
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    sendSuccess(res, 'Order cancelled successfully', order);
  } catch (error) {
    console.error('Cancel order error:', error);
    sendError(res, 'Server error cancelling order', 500);
  }
};

// Get order statistics (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Monthly revenue (last 12 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'shipped', 'delivered'] },
          createdAt: { $gte: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    sendSuccess(res, 'Order statistics retrieved successfully', {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      recentOrders,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    sendError(res, 'Server error retrieving order statistics', 500);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
};
