const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getMySales,
  getAllOrders,
  createOrderValidation,
  updateStatusValidation
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrderValidation, checkValidation, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/sales', getMySales);
router.get('/:id', getOrder);
router.put('/:id/status', updateStatusValidation, checkValidation, updateOrderStatus);

// Admin routes
router.get('/admin/all', admin, getAllOrders);

module.exports = router;