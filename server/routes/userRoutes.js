const express = require('express');
const {
  getUserProfile,
  getUserProducts,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  updateUserStatusValidation
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);
router.get('/:id/products', getUserProducts);

// Protected routes
router.use(protect);

// Admin only routes
router.get('/', admin, getAllUsers);
router.get('/admin/stats', admin, getDashboardStats);
router.put('/:id/status', admin, updateUserStatusValidation, checkValidation, updateUserStatus);
router.delete('/:id', admin, deleteUser);

module.exports = router;