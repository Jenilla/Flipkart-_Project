const asyncHandler = require('express-async-handler');
const { sequelize, Cart, CartItem, Order, OrderItem, Product } = require('../models');

// @desc    Place an order from the current contents of the user's cart
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    where: { userId: req.user.id },
    include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
  });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const cartItems = cart.items.filter((item) => item.product);

  const itemsPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.originalPrice || 0) * item.quantity,
    0
  );
  const sellingPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discount = Math.max(itemsPrice - sellingPrice, 0);
  const deliveryCharge = sellingPrice >= 500 ? 0 : 40;
  const totalAmount = sellingPrice + deliveryCharge;

  const order = await sequelize.transaction(async (t) => {
    const created = await Order.create(
      {
        userId: req.user.id,
        shippingAddress: req.body.shippingAddress || {},
        paymentMethod: req.body.paymentMethod || 'COD',
        itemsPrice,
        discount,
        deliveryCharge,
        totalAmount,
      },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      cartItems.map((item) => ({
        orderId: created.id,
        productId: item.product.id,
        title: item.product.title,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      })),
      { transaction: t }
    );

    // Empty the cart now that the order has been placed
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    return created;
  });

  const fullOrder = await Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'items' }],
  });

  res.status(201).json({ success: true, order: fullOrder });
});

// @desc    Get the logged-in user's order history
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    include: [{ model: OrderItem, as: 'items' }],
  });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get a single order's details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ model: OrderItem, as: 'items' }],
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({ success: true, order });
});

module.exports = { placeOrder, getOrders, getOrderById };
