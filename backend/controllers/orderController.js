const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// @desc    Place an order from the current contents of the user's cart
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product._id,
      title: item.product.title,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

  const itemsPrice = cart.items.reduce(
    (sum, item) => sum + (item.product?.originalPrice || 0) * item.quantity,
    0
  );
  const sellingPrice = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discount = Math.max(itemsPrice - sellingPrice, 0);
  const deliveryCharge = sellingPrice >= 500 ? 0 : 40;
  const totalAmount = sellingPrice + deliveryCharge;

  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress: req.body.shippingAddress || {},
    paymentMethod: req.body.paymentMethod || 'COD',
    itemsPrice,
    discount,
    deliveryCharge,
    totalAmount,
  });

  // Empty the cart now that the order has been placed
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

// @desc    Get the logged-in user's order history
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get a single order's details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({ success: true, order });
});

module.exports = { placeOrder, getOrders, getOrderById };
