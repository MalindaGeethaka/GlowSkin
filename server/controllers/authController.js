const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/authHelpers');
const { sendSuccess, sendError } = require('../utils/helpers');
const { sendEmail } = require('../utils/emailService');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists with this email', 400);
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      name,
      email,
      password, // Don't hash here - let the model handle it
      phone,
      address,
      role: role || 'customer'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email
    try {
      await sendEmail(
        email,
        'Welcome to GlowSkin!',
        `Welcome ${name}! Your account has been created successfully.`
      );
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    sendSuccess(res, 'User registered successfully', {
      token,
      user: user.toJSON()
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    sendError(res, 'Server error during registration', 500);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid email or password', 400);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 400);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    sendSuccess(res, 'Login successful', {
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Server error during login', 500);
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    sendSuccess(res, 'User profile retrieved', req.user.toJSON());
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Server error retrieving profile', 500);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    sendSuccess(res, 'Profile updated successfully', user.toJSON());
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Server error updating profile', 500);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required', 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    // Update password (using the schema pre-save hook)
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 'Server error changing password', 500);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
