const { body, query } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse, getPagination, paginatedResponse } = require('../utils/response');

// @desc    Get all products with filtering, searching, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  const { page, limit, category, condition, search, sortBy, minPrice, maxPrice } = req.query;

  // Build base query
  let query = { isAvailable: true };

  // Exclude current user's products if authenticated (and not admin) so user doesn't see own listings in general feed
  if (req.user && req.user.role !== 'admin') {
    query.seller = { $ne: req.user.id };
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Condition filter
  if (condition && condition !== 'all') {
    query.condition = condition;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  // Sort options
  let sort = { createdAt: -1 }; // Default: newest first
  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'popular':
        sort = { views: -1 };
        break;
    }
  }

  // Execute query
  const products = await Product.find(query)
    .populate('seller', 'username firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(query);

  paginatedResponse(res, products, total, pageNum, limitNum, 'Products retrieved successfully');
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'username firstName lastName avatar phone email');

  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  // Increment views (only if not the owner)
  if (!req.user || product.seller._id.toString() !== req.user.id) {
    await product.incrementViews();
  }

  successResponse(res, 200, 'Product retrieved successfully', { product });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, category, condition, tags, location, quantity, imageUrls } = req.body;

  // Build images array: prioritize uploaded files (multer) else parse imageUrls (comma/newline separated)
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: title }));
  } else if (imageUrls) {
    const parsed = imageUrls
      .split(/\n|,/)
      .map(u => u.trim())
      .filter(u => /^https?:\/\//i.test(u));
    images = parsed.slice(0, 5).map(u => ({ url: u, alt: title }));
  }

  // Fallback: if still empty, leave default schema placeholder
  const product = await Product.create({
    title,
    description,
    price,
    category,
    condition,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    location,
    quantity: quantity || 1,
    seller: req.user.id,
    ...(images.length ? { images } : {})
  });

  // Populate seller info
  await product.populate('seller', 'username firstName lastName');

  successResponse(res, 201, 'Product created successfully', { product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  // Check if user owns the product
  if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Not authorized to update this product');
  }

  const { title, description, price, category, condition, tags, location, quantity, isAvailable } = req.body;

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (price !== undefined) updateFields.price = price;
  if (category !== undefined) updateFields.category = category;
  if (condition !== undefined) updateFields.condition = condition;
  if (tags !== undefined) updateFields.tags = tags.split(',').map(tag => tag.trim());
  if (location !== undefined) updateFields.location = location;
  if (quantity !== undefined) updateFields.quantity = quantity;
  if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;

  product = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  ).populate('seller', 'username firstName lastName');

  successResponse(res, 200, 'Product updated successfully', { product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  // Check if user owns the product
  if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Not authorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id);

  successResponse(res, 200, 'Product deleted successfully');
});

// @desc    Get user's products
// @route   GET /api/products/my-products
// @access  Private
const getMyProducts = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  const products = await Product.find({ seller: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments({ seller: req.user.id });

  paginatedResponse(res, products, total, pageNum, limitNum, 'Your products retrieved successfully');
});

// @desc    Toggle like product
// @route   POST /api/products/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  const userId = req.user.id;
  const likeIndex = product.likes.indexOf(userId);

  if (likeIndex === -1) {
    // Add like
    product.likes.push(userId);
  } else {
    // Remove like
    product.likes.splice(likeIndex, 1);
  }

  await product.save();

  successResponse(res, 200, 'Product like toggled successfully', {
    liked: likeIndex === -1,
    likeCount: product.likes.length
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Product.distinct('category');

  successResponse(res, 200, 'Categories retrieved successfully', { categories });
});

// Validation rules
const createProductValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Toys', 'Vehicles', 'Home & Garden', 'Health & Beauty', 'Others'])
    .withMessage('Please select a valid category'),
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Please select a valid condition')
];

const updateProductValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Toys', 'Vehicles', 'Home & Garden', 'Health & Beauty', 'Others'])
    .withMessage('Please select a valid category'),
  body('condition')
    .optional()
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Please select a valid condition')
];

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  toggleLike,
  getCategories,
  createProductValidation,
  updateProductValidation
};