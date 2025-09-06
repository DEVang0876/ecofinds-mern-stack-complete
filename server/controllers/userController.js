const { body } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse, getPagination, paginatedResponse } = require('../utils/response');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  if (!user.isActive) {
    return errorResponse(res, 404, 'User not found');
  }

  successResponse(res, 200, 'User profile retrieved successfully', { user: user.getPublicProfile() });
});

// @desc    Get user's public products
// @route   GET /api/users/:id/products
// @access  Public
const getUserProducts = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  // Check if user exists
  const user = await User.findById(req.params.id);
  if (!user || !user.isActive) {
    return errorResponse(res, 404, 'User not found');
  }

  const products = await Product.find({ 
    seller: req.params.id, 
    isAvailable: true 
  })
    .populate('seller', 'username firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments({ 
    seller: req.params.id, 
    isAvailable: true 
  });

  paginatedResponse(res, products, total, pageNum, limitNum, 'User products retrieved successfully');
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page, limit, search, status } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  // Build query
  let query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } }
    ];
  }

  // Status filter
  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  const publicUsers = users.map(user => user.getPublicProfile());

  paginatedResponse(res, publicUsers, total, pageNum, limitNum, 'Users retrieved successfully');
});

// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return errorResponse(res, 400, 'isActive must be a boolean value');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Don't allow admin to deactivate themselves
  if (req.user.id === req.params.id && !isActive) {
    return errorResponse(res, 400, 'You cannot deactivate your own account');
  }

  user.isActive = isActive;
  await user.save();

  successResponse(res, 200, `User ${isActive ? 'activated' : 'deactivated'} successfully`, { 
    user: user.getPublicProfile() 
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Don't allow admin to delete themselves
  if (req.user.id === req.params.id) {
    return errorResponse(res, 400, 'You cannot delete your own account');
  }

  // Delete user's products first
  await Product.deleteMany({ seller: req.params.id });

  // Delete user
  await User.findByIdAndDelete(req.params.id);

  successResponse(res, 200, 'User and associated products deleted successfully');
});

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    activeUsers,
    totalProducts,
    availableProducts,
    newUsersThisMonth,
    newProductsThisMonth
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Product.countDocuments(),
    Product.countDocuments({ isAvailable: true }),
    User.countDocuments({
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      }
    }),
    Product.countDocuments({
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      }
    })
  ]);

  const stats = {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      newThisMonth: newUsersThisMonth
    },
    products: {
      total: totalProducts,
      available: availableProducts,
      unavailable: totalProducts - availableProducts,
      newThisMonth: newProductsThisMonth
    }
  };

  successResponse(res, 200, 'Dashboard stats retrieved successfully', { stats });
});

// Validation rules
const updateUserStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

module.exports = {
  getUserProfile,
  getUserProducts,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  updateUserStatusValidation
};