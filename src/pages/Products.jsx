<<<<<<< HEAD
export default function Products() {
  return <h1>Products Page</h1>;
}
=======
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { categories } from '../data/products.js';
import { fetchProducts } from '../services/productService.js';
import './Products.css';

const PRICE_BRACKETS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-1000', label: 'Under ₹1,000', min: 0, max: 1000 },
  { id: '1000-5000', label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { id: '5000-20000', label: '₹5,000 - ₹20,000', min: 5000, max: 20000 },
  { id: 'above-20000', label: 'Above ₹20,000', min: 20000, max: Infinity },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 100 })
      .then((result) => setProducts(result.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const activeCategory = searchParams.get('category') || 'all';
  const activePrice = searchParams.get('price') || 'all';
  const activeSearch = searchParams.get('search') || '';

  useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const priceBracket =
    PRICE_BRACKETS.find((bracket) => bracket.id === activePrice) || PRICE_BRACKETS[0];

  const filteredProducts = useMemo(() => {
    const term = activeSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (product.category || '').toLowerCase() === activeCategory.toLowerCase();
      const matchesPrice =
        product.price >= priceBracket.min && product.price <= priceBracket.max;
      const matchesSearch =
        !term || product.name.toLowerCase().includes(term);
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [activeCategory, activeSearch, priceBracket]);

  const clearFilters = () => setSearchParams({});

  return (
    <div className="container products-page">
      <aside className="products-filters">
        <div className="products-filters-header">
          <h2>Filters</h2>
          {(activeCategory !== 'all' || activePrice !== 'all' || activeSearch) && (
            <button className="products-filters-clear" onClick={clearFilters}>
              Clear all
            </button>
          )}
        </div>

        <form className="products-search-mobile" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="products-filter-group">
          <h3>Category</h3>
          <ul>
            <li>
              <button
                className={activeCategory === 'all' ? 'is-active' : ''}
                onClick={() => updateParam('category', 'all')}
              >
                All Categories
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={activeCategory === category.id ? 'is-active' : ''}
                  onClick={() => updateParam('category', category.id)}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="products-filter-group">
          <h3>Price</h3>
          <ul>
            {PRICE_BRACKETS.map((bracket) => (
              <li key={bracket.id}>
                <button
                  className={activePrice === bracket.id ? 'is-active' : ''}
                  onClick={() => updateParam('price', bracket.id)}
                >
                  {bracket.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="products-results">
        <div className="products-results-header">
          <p>
            {activeSearch && <>Results for &ldquo;{activeSearch}&rdquo; &middot; </>}
            {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} found
          </p>
        </div>

        {loading ? (
          <div className="products-empty">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="products-empty">
            <p>No products match your filters.</p>
            <button className="btn btn-outline" onClick={clearFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;
>>>>>>> 4ff4200c6dd726ed94a558b4bdc604012afcf19f
