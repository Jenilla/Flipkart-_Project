import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { getDiscountPercent } from '../services/productService.js';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = getDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <span className="product-card-rating-badge">{product.rating.toFixed(1)} ★</span>
          <span className="product-card-rating-count">({product.ratingCount.toLocaleString('en-IN')})</span>
        </div>
        <div className="product-card-price-row">
          <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          {discount > 0 && (
            <>
              <span className="product-card-original-price">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="product-card-discount">{discount}% off</span>
            </>
          )}
        </div>
        <button className="btn btn-primary product-card-add" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
