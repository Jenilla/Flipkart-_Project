import { Link } from 'react-router-dom';
import { categories } from '../data/products.js';
import './CategoryBar.css';

function CategoryBar() {
  return (
    <nav className="category-bar" aria-label="Shop by category">
      <div className="container category-bar-inner">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            className="category-item"
          >
            <span className="category-icon" aria-hidden="true">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default CategoryBar;
