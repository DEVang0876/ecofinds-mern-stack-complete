const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addToCartValidation,
  updateCartValidation
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCartValidation, checkValidation, addToCart);
router.put('/update', updateCartValidation, checkValidation, updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;