import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addToCartRequest,
  clearCartRequest,
  decreaseQuantityRequest,
  fetchCart,
  increaseQuantityRequest,
  removeFromCartRequest,
} from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

const emptyTotals = {
  totalItems: 0,
  totalPrice: 0,
  sellingPrice: 0,
  discount: 0,
  deliveryCharge: 0,
  finalTotal: 0,
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState(emptyTotals);

  const applyCart = (cart) => {
    setItems(cart.items || []);
    setTotals({
      totalItems: cart.totalItems || 0,
      totalPrice: cart.totalPrice || 0,
      sellingPrice: cart.sellingPrice || 0,
      discount: cart.discount || 0,
      deliveryCharge: cart.deliveryCharge || 0,
      finalTotal: cart.finalTotal || 0,
    });
  };

  // Load the user's cart from the backend whenever they log in;
  // clear local state when they log out.
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().then(applyCart).catch(() => {
        setItems([]);
        setTotals(emptyTotals);
      });
    } else {
      setItems([]);
      setTotals(emptyTotals);
    }
  }, [isAuthenticated]);

  const requireLogin = () => {
    navigate('/login', { state: { from: '/cart' } });
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }
    const cart = await addToCartRequest(product.id, quantity);
    applyCart(cart);
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    const cart = await removeFromCartRequest(productId);
    applyCart(cart);
  };

  const increaseQuantity = async (productId) => {
    if (!isAuthenticated) return;
    const cart = await increaseQuantityRequest(productId);
    applyCart(cart);
  };

  const decreaseQuantity = async (productId) => {
    if (!isAuthenticated) return;
    const cart = await decreaseQuantityRequest(productId);
    applyCart(cart);
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    const cart = await clearCartRequest();
    applyCart(cart);
  };

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      ...totals,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, totals, isAuthenticated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
