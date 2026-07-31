const asyncHandler = require('express-async-handler');
const { Cart, CartItem, Product } = require('../models');

// Shapes a cart (with its items + populated products) into the
// { items, totals } payload the frontend's CartContext expects, computing
// totals server-side so the frontend never has to trust client-held prices.
const formatCart = (cart) => {
  const items = (cart?.items || [])
    .filter((item) => item.product) // drop items whose product was deleted
    .map((item) => {
      const product = item.product;
      return {
        id: product.id,
        productId: product.id,
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

// Fetches a cart row (creating one if it somehow doesn't exist yet) together
// with its items and each item's product, mirroring the old
// `.populate('items.product')` call.
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
  });

  if (!cart) {
    await Cart.create({ userId });
    cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });
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

  const product = await Product.findByPk(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const qty = Math.max(Number(quantity) || 1, 1);
  const cart = await getOrCreateCart(req.user.id);

  const existingItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (existingItem) {
    await existingItem.update({ quantity: existingItem.quantity + qty });
  } else {
    await CartItem.create({ cartId: cart.id, productId, quantity: qty });
  }

  const updated = await getOrCreateCart(req.user.id);
  res.status(200).json({ success: true, cart: formatCart(updated) });
});

// @desc    Increase quantity of one cart item by 1
// @route   PUT /api/cart/increase/:id
// @access  Private
const increaseQuantity = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const item = await CartItem.findOne({ where: { cartId: cart.id, productId: req.params.id } });

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  await item.update({ quantity: item.quantity + 1 });

  const updated = await getOrCreateCart(req.user.id);
  res.status(200).json({ success: true, cart: formatCart(updated) });
});

// @desc    Decrease quantity of one cart item by 1 (removes it at 0)
// @route   PUT /api/cart/decrease/:id
// @access  Private
const decreaseQuantity = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const item = await CartItem.findOne({ where: { cartId: cart.id, productId: req.params.id } });

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  const nextQuantity = item.quantity - 1;
  if (nextQuantity <= 0) {
    await item.destroy();
  } else {
    await item.update({ quantity: nextQuantity });
  }

  const updated = await getOrCreateCart(req.user.id);
  res.status(200).json({ success: true, cart: formatCart(updated) });
});

// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
const removeItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await CartItem.destroy({ where: { cartId: cart.id, productId: req.params.id } });

  const updated = await getOrCreateCart(req.user.id);
  res.status(200).json({ success: true, cart: formatCart(updated) });
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await CartItem.destroy({ where: { cartId: cart.id } });

  const updated = await getOrCreateCart(req.user.id);
  res.status(200).json({ success: true, cart: formatCart(updated) });
});

module.exports = {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
};
