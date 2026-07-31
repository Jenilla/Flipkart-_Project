const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { User, Cart } = require('../models');
const { sendTokenResponse, cookieOptions } = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists.');
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });

  // Every user gets an empty cart created up front so cart lookups never 404.
  await Cart.create({ userId: user.id });

  sendTokenResponse(user, 201, res);
});

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.scope('withPassword').findOne({ where: { email: normalizedEmail } });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  // Guarantee a cart row exists even for users created before this field existed
  await Cart.findOrCreate({ where: { userId: user.id }, defaults: { userId: user.id } });

  sendTokenResponse(user, 200, res);
});

// @desc    Log out the current user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res
    .cookie('token', '', { ...cookieOptions(), expires: new Date(0) })
    .status(200)
    .json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get the currently logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.status(200).json({ success: true, user });
});

module.exports = { signup, login, logout, getMe };
