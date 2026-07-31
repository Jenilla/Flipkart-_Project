import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

function Navbar() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Keep the navbar search box in sync with the URL's ?search= param so it
  // doesn't look empty/stale when the user is already on /products.
  useEffect(() => {
    if (location.pathname === '/products') {
      setQuery(searchParams.get('search') || '');
    } else {
      setQuery('');
    }
  }, [location.pathname, searchParams]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products');
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo-main">Shop</span>
          <span className="navbar-logo-accent">Kart</span>
          <span className="navbar-logo-plus" aria-hidden="true">+</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearchSubmit} role="search">
          <input
            type="search"
            placeholder="Search for products, brands and more"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-actions ${menuOpen ? 'is-open' : ''}`}>
          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-user-name">Hi, {user.name.split(' ')[0]}</span>
              <button className="navbar-link navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline navbar-login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}

          <Link to="/products" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          <Link to="/cart" className="navbar-cart" onClick={() => setMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6h15l-1.5 9h-12z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M6 6 4.5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
              <circle cx="17.5" cy="19" r="1.4" fill="currentColor" />
            </svg>
            <span>Cart</span>
            {totalItems > 0 && <span className="navbar-cart-count">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
