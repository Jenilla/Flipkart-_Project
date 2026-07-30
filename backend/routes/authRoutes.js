const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { signup, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Slow down brute-force attempts against login/signup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});

const signupValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidators = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', authLimiter, signupValidators, signup);
router.post('/login', authLimiter, loginValidators, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
