const express = require('express');
const {
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
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getProduct);

// Protected routes
router.use(protect);

router.get('/user/my-products', getMyProducts);
router.post('/', uploadMultiple, handleUploadError, createProductValidation, checkValidation, createProduct);
router.put('/:id', uploadMultiple, handleUploadError, updateProductValidation, checkValidation, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/like', toggleLike);

module.exports = router;