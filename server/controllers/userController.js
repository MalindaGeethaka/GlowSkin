const User = require('../models/User');
const { sendSuccess, sendError, getPaginationData } = require('../utils/helpers');
const { hashPassword } = require('../utils/authHelpers');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const { skip, totalPages, totalItems } = await getPaginationData(User, filter, page, limit);
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    sendSuccess(res, 'Users retrieved successfully', {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    sendError(res, 'Server error retrieving users', 500);
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    sendError(res, 'Server error retrieving user', 500);
  }
};

// Create user (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      phone,
      address
    });

    await user.save();

    sendSuccess(res, 'User created successfully', user.toJSON(), 201);
  } catch (error) {
    console.error('Create user error:', error);
    sendError(res, 'Server error creating user', 500);
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address, isActive } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendError(res, 'Email already exists', 400);
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    sendSuccess(res, 'User updated successfully', user.toJSON());
  } catch (error) {
    console.error('Update user error:', error);
    sendError(res, 'Server error updating user', 500);
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return sendError(res, 'Cannot delete your own account', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    await User.findByIdAndDelete(id);

    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 'Server error deleting user', 500);
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    sendSuccess(res, 'User statistics retrieved successfully', {
      totalUsers,
      totalCustomers,
      totalAdmins,
      activeUsers,
      recentRegistrations
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    sendError(res, 'Server error retrieving user statistics', 500);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};
