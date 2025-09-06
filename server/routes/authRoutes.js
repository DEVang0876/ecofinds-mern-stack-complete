const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  registerValidation,
  loginValidation,
  changePasswordValidation
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, checkValidation, register);
router.post('/login', loginValidation, checkValidation, login);

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/me', updateProfile);
router.put('/change-password', changePasswordValidation, checkValidation, changePassword);

module.exports = router;