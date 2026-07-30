<<<<<<< HEAD
export default function ProductDetails() {
  return <h1>Product Details Page</h1>;
}
=======
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { fetchProductById, getDiscountPercent } from '../services/productService.js';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container product-details-missing">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-details-missing">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/cart');
  };

  return (
    <div className="container product-details">
      <nav className="product-details-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
      </nav>

      <div className="product-details-grid">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>

          <div className="product-details-rating">
            <span className="product-details-rating-badge">{product.rating.toFixed(1)} ★</span>
            <span>{product.ratingCount.toLocaleString('en-IN')} ratings</span>
          </div>

          <div className="product-details-price-row">
            <span className="product-details-price">₹{product.price.toLocaleString('en-IN')}</span>
            {discount > 0 && (
              <>
                <span className="product-details-original-price">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="product-details-discount">{discount}% off</span>
              </>
            )}
          </div>

          <p className={`product-details-availability ${product.availability === 'In Stock' ? 'is-instock' : 'is-low'}`}>
            {product.availability}
          </p>

          <p className="product-details-description">{product.description}</p>

          <div className="product-details-actions">
            <button className="btn btn-accent" onClick={handleAddToCart}>
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
            <button className="btn btn-primary" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
>>>>>>> 4ff4200c6dd726ed94a558b4bdc604012afcf19f
