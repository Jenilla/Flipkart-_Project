import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';
import './ProductSection.css';

function ProductSection({ title, subtitle, products, viewAllHref }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="product-section">
      <div className="container">
        <div className="product-section-header">
          <div>
            <h2 className="product-section-title">{title}</h2>
            {subtitle && <p className="product-section-subtitle">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link to={viewAllHref} className="product-section-viewall">
              View All &rarr;
            </Link>
          )}
        </div>
        <div className="product-section-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
