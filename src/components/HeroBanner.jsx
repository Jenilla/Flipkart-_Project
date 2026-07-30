import { Link } from 'react-router-dom';
import './HeroBanner.css';

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="container hero-banner-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">Big Shopping Days</p>
          <h1 className="hero-title">Everything you need, one cart away.</h1>
          <p className="hero-subtitle">
            Top deals on electronics, fashion, home essentials and more — new
            offers added every day.
          </p>
          <Link to="/products" className="btn btn-accent hero-cta">
            Shop the sale
          </Link>
        </div>
        <div className="hero-badges">
          <div className="hero-badge">
            <span className="hero-badge-value">Up to 70%</span>
            <span className="hero-badge-label">off Electronics</span>
          </div>
          <div className="hero-badge">
            <span className="hero-badge-value">Up to 60%</span>
            <span className="hero-badge-label">off Fashion</span>
          </div>
          <div className="hero-badge">
            <span className="hero-badge-value">Free Delivery</span>
            <span className="hero-badge-label">on orders over ₹500</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
