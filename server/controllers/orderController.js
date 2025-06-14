const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendSuccess, sendError, getPaginationData } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, paymentMethod = 'cash_on_delivery', notes } = req.body;
    
    console.log('Order creation request:', JSON.stringify({ items, shippingAddress, totalPrice }, null, 2));
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Error: Order items are required');
      return sendError(res, 'Order items are required', 400);
    }
    
    if (!shippingAddress) {
      console.log('Error: Shipping address is required');
      return sendError(res, 'Shipping address is required', 400);
    }
    
    // Validate and calculate total
    let calculatedTotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      console.log('Processing item:', item);
      const product = await Product.findById(item.product);
      if (!product) {
        console.log(`Error: Product not found: ${item.product}`);
        return sendError(res, `Product not found: ${item.product}`, 404);
      }
      
      if (product.stock < item.quantity) {
        console.log(`Error: Insufficient stock for ${product.title}`);
        return sendError(res, `Insufficient stock for ${product.title}`, 400);
      }
      
      const itemTotal = (item.price || product.price) * item.quantity;
      calculatedTotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price || product.price,
        total: itemTotal
      });
    }

    // Generate order number
    const orderNumber = 'GS' + Date.now();

    // Create order with the correct field mapping
    const order = new Order({
      user: req.user.id,
      orderNumber,
      items: orderItems,
      subtotal: calculatedTotal,
      shippingFee: 500, // Standard shipping fee
      totalAmount: totalPrice || (calculatedTotal + 500),
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.address, // Map 'address' to 'street'
        city: shippingAddress.city,
        state: 'Western', // Default state
        zipCode: '00000', // Default zip
        country: 'Sri Lanka'
      },
      paymentMethod,
      notes
    });

    await order.save();

    // Update product stocks
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate order details for response
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'title images');

    // Send order confirmation email
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        await sendEmail(
          user.email,
          'Order Confirmation - GlowSkin',
          `
            <h2>Thank you for your order!</h2>
            <p>Dear ${user.name},</p>
            <p>Your order has been successfully placed.</p>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> Rs. ${(totalPrice || (calculatedTotal + 500)).toLocaleString()}</p>
            <p>We'll send you another email when your order is shipped.</p>
            <p>Thank you for choosing GlowSkin!</p>
          `
        );
      }
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    sendSuccess(res, 'Order created successfully', populatedOrder, 201);
  } catch (error) {
    console.error('Create order error:', error);
    sendError(res, 'Server error creating order', 500);
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const { skip, totalPages, totalItems } = await getPaginationData(Order, filter, page, limit);
      const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'title images');

    // Transform orders to ensure compatibility with frontend
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      totalPrice: order.totalAmount // Add legacy field for compatibility
    }));

    sendSuccess(res, 'Orders retrieved successfully', {
      orders: transformedOrders,
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
      .populate('user', 'name email')
      .populate('items.product', 'title images');
    
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }    // Check if user can access this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    // Transform order to ensure compatibility with frontend
    const transformedOrder = {
      ...order.toObject(),
      totalPrice: order.totalAmount // Add legacy field for compatibility
    };

    sendSuccess(res, 'Order retrieved successfully', transformedOrder);
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
    if (userId) filter.user = userId;
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
      .populate('user', 'name email')
      .populate('items.product', 'title');

    // Transform orders to ensure compatibility with frontend
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      totalPrice: order.totalAmount // Add legacy field for compatibility
    }));

    sendSuccess(res, 'Orders retrieved successfully', {
      orders: transformedOrders,
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
    
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    const oldStatus = order.status;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    // Send status update email
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and is being prepared.',
        processing: 'Your order is being processed.',
        shipped: `Your order has been shipped${trackingNumber ? ` with tracking number: ${trackingNumber}` : ''}.`,
        delivered: 'Your order has been delivered. Thank you for shopping with GlowSkin!',
        cancelled: 'Your order has been cancelled.'
      };

      if (statusMessages[status]) {
        await sendEmail(
          order.user.email,
          `Order Update - GlowSkin`,
          `
            <h2>Order Status Update</h2>
            <p>Hello ${order.user.name},</p>
            <p>${statusMessages[status]}</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p>Thank you for choosing GlowSkin!</p>
          `
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
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return sendError(res, 'Access denied', 403);
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return sendError(res, 'Cannot cancel order in current status', 400);
    }

    order.status = 'cancelled';
    if (reason) order.cancellationReason = reason;

    await order.save();

    // Restore product stocks
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
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
