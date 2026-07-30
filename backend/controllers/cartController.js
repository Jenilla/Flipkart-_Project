const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Shapes a populated cart document into the { items, totals } payload the
// frontend's CartContext expects, computing totals server-side so the
// frontend never has to trust client-held prices.
const formatCart = (cart) => {
  const items = (cart?.items || [])
    .filter((item) => item.product) // drop items whose product was deleted
    .map((item) => {
      const product = item.product;
      return {
        id: product._id,
        productId: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: item.quantity,
        stock: product.stock,
      };
    });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const sellingPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.max(totalPrice - sellingPrice, 0);
  const deliveryCharge = items.length === 0 || sellingPrice >= 500 ? 0 : 40;
  const finalTotal = sellingPrice + deliveryCharge;

  return {
    items,
    totalItems,
    totalPrice,
    sellingPrice,
    discount,
    deliveryCharge,
    finalTotal,
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate('items.product');
  }
  return cart;
};

// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  res.status(200).json({ success: true, cart: formatCart(cart) });
});

// @desc    Add a product to the cart (or bump its quantity if already present)
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const qty = Math.max(Number(quantity) || 1, 1);
  const cart = await getOrCreateCart(req.user.id);

  const existingItem = cart.items.find((item) => item.product._id.toString() === productId);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty });
  }

  await cart.save();
  const populated = await cart.populate('items.product');
  res.status(200).json({ success: true, cart: formatCart(populated) });
});

// @desc    Increase quantity of one cart item by 1
// @route   PUT /api/cart/increase/:id
// @access  Private
const increaseQuantity = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const item = cart.items.find((i) => i.product._id.toString() === req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity += 1;
  await cart.save();
  const populated = await cart.populate('items.product');
  res.status(200).json({ success: true, cart: formatCart(populated) });
});

// @desc    Decrease quantity of one cart item by 1 (removes it at 0)
// @route   PUT /api/cart/decrease/:id
// @access  Private
const decreaseQuantity = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const item = cart.items.find((i) => i.product._id.toString() === req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity -= 1;
  cart.items = cart.items.filter((i) => i.quantity > 0);

  await cart.save();
  const populated = await cart.populate('items.product');
  res.status(200).json({ success: true, cart: formatCart(populated) });
});

// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
const removeItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  cart.items = cart.items.filter((i) => i.product._id.toString() !== req.params.id);

  await cart.save();
  const populated = await cart.populate('items.product');
  res.status(200).json({ success: true, cart: formatCart(populated) });
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  cart.items = [];
  await cart.save();
  res.status(200).json({ success: true, cart: formatCart(cart) });
});

module.exports = {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
};
