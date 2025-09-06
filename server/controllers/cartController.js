const { body } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'title price images isAvailable seller',
      populate: {
        path: 'seller',
        select: 'username firstName lastName'
      }
    });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Filter out unavailable products
  const availableItems = cart.items.filter(item => 
    item.product && item.product.isAvailable
  );

  // If some items were removed, update the cart
  if (availableItems.length !== cart.items.length) {
    cart.items = availableItems;
    await cart.save();
  }

  successResponse(res, 200, 'Cart retrieved successfully', { cart });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Debug incoming payload
  console.log('addToCart payload:', req.body);

  // Check if product exists and is available
  const product = await Product.findById(productId);

  if (!product) {
    console.log('addToCart error: Product not found for id', productId);
    return errorResponse(res, 404, 'Product not found', { reason: 'product_not_found' });
  }

  if (!product.isAvailable) {
    console.log('addToCart error: Product not available', productId);
    return errorResponse(res, 400, 'Product is not available', { reason: 'product_unavailable' });
  }

  // Check if user is trying to add their own product
  if (product.seller.toString() === req.user.id) {
    console.log('addToCart error: cannot add own product', { productId, seller: product.seller.toString(), user: req.user.id });
    return errorResponse(res, 400, 'You cannot add your own product to cart', { reason: 'own_product' });
  }

  // Check stock
  if (product.quantity < quantity) {
    console.log('addToCart error: insufficient stock', { available: product.quantity, requested: quantity });
    return errorResponse(res, 400, `Only ${product.quantity} items available in stock`, { reason: 'insufficient_stock', available: product.quantity });
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex >= 0) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (newQuantity > product.quantity) {
      return errorResponse(res, 400, `Cannot add more items. Maximum available: ${product.quantity}`);
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  await cart.save();

  // Populate and return updated cart
  await cart.populate({
    path: 'items.product',
    select: 'title price images isAvailable seller',
    populate: {
      path: 'seller',
      select: 'username firstName lastName'
    }
  });

  successResponse(res, 200, 'Item added to cart successfully', { cart });
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return errorResponse(res, 400, 'Quantity must be at least 1');
  }

  // Check if product exists and get stock info
  const product = await Product.findById(productId);

  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  if (quantity > product.quantity) {
    return errorResponse(res, 400, `Only ${product.quantity} items available in stock`);
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return errorResponse(res, 404, 'Cart not found');
  }

  await cart.updateItemQuantity(productId, quantity);

  // Populate and return updated cart
  await cart.populate({
    path: 'items.product',
    select: 'title price images isAvailable seller',
    populate: {
      path: 'seller',
      select: 'username firstName lastName'
    }
  });

  successResponse(res, 200, 'Cart updated successfully', { cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return errorResponse(res, 404, 'Cart not found');
  }

  await cart.removeItem(productId);

  // Populate and return updated cart
  await cart.populate({
    path: 'items.product',
    select: 'title price images isAvailable seller',
    populate: {
      path: 'seller',
      select: 'username firstName lastName'
    }
  });

  successResponse(res, 200, 'Item removed from cart successfully', { cart });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return errorResponse(res, 404, 'Cart not found');
  }

  await cart.clearCart();

  successResponse(res, 200, 'Cart cleared successfully', { cart });
});

// Validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
];

const updateCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
];

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addToCartValidation,
  updateCartValidation
};