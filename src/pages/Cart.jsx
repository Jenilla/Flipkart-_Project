import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { placeOrderRequest } from '../services/orderService.js';
import './Cart.css';

function formatINR(amount) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `₹${safeAmount.toLocaleString('en-IN')}`;
}

function Cart() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    discount,
    deliveryCharge,
    finalTotal,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setOrderError('');

    try {
      await placeOrderRequest();
      setOrderPlaced(true);
      await clearCart();
    } catch (error) {
      setOrderError(
        error?.response?.data?.message ||
          'Could not place order. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container cart-empty-state">
        <div className="cart-order-success">✓</div>
        <h2>Order placed successfully!</h2>
        <p>
          Thank you for shopping with ShopKart. This is a demo checkout — no
          payment was processed.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container cart-empty-state">
        <h2>Your cart is empty</h2>
        <p>
          Looks like you haven't added anything yet. Explore products and find
          something you like.
        </p>

        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="cart-items">
        <div className="cart-items-header">
          <h1>
            My Cart ({totalItems} item{totalItems === 1 ? '' : 's'})
          </h1>
        </div>

        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <Link to={`/product/${item.id}`} className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </Link>

            <div className="cart-item-details">
              <Link to={`/product/${item.id}`} className="cart-item-name">
                {item.name}
              </Link>

              <div className="cart-item-price-row">
                <span className="cart-item-price">
                  {formatINR(item.price)}
                </span>

                {item.originalPrice > item.price && (
                  <span className="cart-item-original-price">
                    {formatINR(item.originalPrice)}
                  </span>
                )}
              </div>

              <div className="cart-item-controls">
                <div className="cart-quantity">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="cart-item-subtotal">
              {formatINR(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <aside className="cart-summary">
        <h2>Price Details</h2>

        <div className="cart-summary-row">
          <span>
            Price ({totalItems} item{totalItems === 1 ? '' : 's'})
          </span>
          <span>{formatINR(totalPrice)}</span>
        </div>

        <div className="cart-summary-row">
          <span>Discount</span>
          <span className="cart-summary-discount">
            − {formatINR(discount)}
          </span>
        </div>

        <div className="cart-summary-row">
          <span>Delivery Charges</span>
          <span className={deliveryCharge === 0 ? 'cart-summary-discount' : ''}>
            {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
          </span>
        </div>

        <div className="cart-summary-divider" />

        <div className="cart-summary-row cart-summary-total">
          <span>Total Amount</span>
          <span>{formatINR(finalTotal)}</span>
        </div>

        {orderError && (
          <p className="auth-error" role="alert">
            {orderError}
          </p>
        )}

        <button
          className="btn btn-accent cart-place-order"
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </aside>
    </div>
  );
}

export default Cart;