import api from './api.js';

// Backend cart items come back as { id, title, image, price, originalPrice,
// quantity, stock }. The existing CartContext/Cart page expect
// { id, name, image, price, originalPrice, quantity } — map title -> name.
const mapCart = (cart) => ({
  items: (cart.items || []).map((item) => ({
    id: item.id,
    name: item.title,
    image: item.image,
    price: item.price,
    originalPrice: item.originalPrice,
    quantity: item.quantity,
    stock: item.stock,
  })),
  totalItems: cart.totalItems,
  totalPrice: cart.totalPrice,
  sellingPrice: cart.sellingPrice,
  discount: cart.discount,
  deliveryCharge: cart.deliveryCharge,
  finalTotal: cart.finalTotal,
});

export const fetchCart = async () => {
  const { data } = await api.get('/cart');
  return mapCart(data.cart);
};

export const addToCartRequest = async (productId, quantity = 1) => {
  const { data } = await api.post('/cart/add', { productId, quantity });
  return mapCart(data.cart);
};

export const increaseQuantityRequest = async (productId) => {
  const { data } = await api.put(`/cart/increase/${productId}`);
  return mapCart(data.cart);
};

export const decreaseQuantityRequest = async (productId) => {
  const { data } = await api.put(`/cart/decrease/${productId}`);
  return mapCart(data.cart);
};

export const removeFromCartRequest = async (productId) => {
  const { data } = await api.delete(`/cart/remove/${productId}`);
  return mapCart(data.cart);
};

export const clearCartRequest = async () => {
  const { data } = await api.delete('/cart/clear');
  return mapCart(data.cart);
};
