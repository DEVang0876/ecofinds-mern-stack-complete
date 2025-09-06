const { body } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse, getPagination, paginatedResponse } = require('../utils/response');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod = 'cash', notes } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'title price seller isAvailable quantity',
      populate: {
        path: 'seller',
        select: 'username firstName lastName'
      }
    });

  if (!cart || cart.items.length === 0) {
    return errorResponse(res, 400, 'Cart is empty');
  }

  // Validate all products are still available and in stock
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    if (!item.product) {
      return errorResponse(res, 400, 'Some products in cart are no longer available');
    }

    if (!item.product.isAvailable) {
      return errorResponse(res, 400, `Product "${item.product.title}" is no longer available`);
    }

    if (item.product.quantity < item.quantity) {
      return errorResponse(res, 400, 
        `Insufficient stock for "${item.product.title}". Available: ${item.product.quantity}, Requested: ${item.quantity}`
      );
    }

    orderItems.push({
      product: item.product._id,
      title: item.product.title,
      price: item.price,
      quantity: item.quantity,
      seller: item.product.seller._id
    });

    totalAmount += item.price * item.quantity;
  }

  // Create order
  const order = await Order.create({
    buyer: req.user.id,
    items: orderItems,
    totalAmount,
    totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    paymentMethod,
    shippingAddress,
    notes
  });

  // Update product quantities
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      { $inc: { quantity: -item.quantity } }
    );
  }

  // Clear the cart
  await cart.clearCart();

  // Populate the created order
  await order.populate([
    {
      path: 'buyer',
      select: 'username firstName lastName email phone'
    },
    {
      path: 'items.product',
      select: 'title images category'
    },
    {
      path: 'items.seller',
      select: 'username firstName lastName'
    }
  ]);

  successResponse(res, 201, 'Order created successfully', { order });
});

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, status } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  // Build query
  let query = { buyer: req.user.id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate([
      {
        path: 'items.product',
        select: 'title images category'
      },
      {
        path: 'items.seller',
        select: 'username firstName lastName'
      }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  paginatedResponse(res, orders, total, pageNum, limitNum, 'Orders retrieved successfully');
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate([
      {
        path: 'buyer',
        select: 'username firstName lastName email phone'
      },
      {
        path: 'items.product',
        select: 'title images category description'
      },
      {
        path: 'items.seller',
        select: 'username firstName lastName email phone'
      }
    ]);

  if (!order) {
    return errorResponse(res, 404, 'Order not found');
  }

  // Check if user is authorized to view this order
  const isAuthorized = order.buyer._id.toString() === req.user.id || 
                      order.items.some(item => item.seller._id.toString() === req.user.id) ||
                      req.user.role === 'admin';

  if (!isAuthorized) {
    return errorResponse(res, 403, 'Not authorized to view this order');
  }

  successResponse(res, 200, 'Order retrieved successfully', { order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return errorResponse(res, 404, 'Order not found');
  }

  // Check authorization
  const isSeller = order.items.some(item => item.seller.toString() === req.user.id);
  const isBuyer = order.buyer.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSeller && !isAdmin) {
    return errorResponse(res, 403, 'Not authorized to update order status');
  }

  // Validate status transitions
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

  if (!validTransitions[order.status].includes(status)) {
    return errorResponse(res, 400, `Cannot change status from ${order.status} to ${status}`);
  }

  // Only buyer can cancel pending orders
  if (status === 'cancelled' && order.status === 'pending' && !isBuyer && !isAdmin) {
    return errorResponse(res, 403, 'Only buyer can cancel pending orders');
  }

  order.status = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  if (status === 'cancelled') {
    order.cancelledAt = new Date();

    // Restore product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } }
      );
    }
  }

  await order.save();

  successResponse(res, 200, 'Order status updated successfully', { order });
});

// @desc    Get orders as seller
// @route   GET /api/orders/sales
// @access  Private
const getMySales = asyncHandler(async (req, res, next) => {
  const { page, limit, status } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  // Build query - find orders containing items sold by current user
  let query = { 'items.seller': req.user.id };

  if (status && status !== 'all') {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate([
      {
        path: 'buyer',
        select: 'username firstName lastName'
      },
      {
        path: 'items.product',
        select: 'title images category'
      }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  paginatedResponse(res, orders, total, pageNum, limitNum, 'Sales retrieved successfully');
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
  const { page, limit, status } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  let query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate([
      {
        path: 'buyer',
        select: 'username firstName lastName email'
      },
      {
        path: 'items.seller',
        select: 'username firstName lastName'
      }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  paginatedResponse(res, orders, total, pageNum, limitNum, 'All orders retrieved successfully');
});

// Validation rules
const createOrderValidation = [
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'paypal', 'stripe', 'other'])
    .withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getMySales,
  getAllOrders,
  createOrderValidation,
  updateStatusValidation
};