import { useEffect, useState } from 'react';
import CategoryBar from '../components/CategoryBar.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import ProductSection from '../components/ProductSection.jsx';
import { fetchProducts } from '../services/productService.js';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts({ limit: 100 })
      .then((result) => setProducts(result.products))
      .catch(() => setProducts([]));
  }, []);

  const topDeals = [...products]
    .sort((a, b) => {
      const discountA = (a.originalPrice - a.price) / a.originalPrice;
      const discountB = (b.originalPrice - b.price) / b.originalPrice;
      return discountB - discountA;
    })
    .slice(0, 6);

  const matchesCategory = (product, category) =>
    (product.category || '').toLowerCase() === category.toLowerCase();

  const electronics = products.filter((p) => matchesCategory(p, 'Laptops')).slice(0, 6);
  const fashion = products.filter((p) => matchesCategory(p, 'Fashion')).slice(0, 6);
  const home = products.filter((p) => matchesCategory(p, 'Speakers')).slice(0, 6);

  return (
    <div>
      <CategoryBar />
      <HeroBanner />
      <ProductSection
        title="Top Deals of the Day"
        subtitle="Best discounts across categories"
        products={topDeals}
        viewAllHref="/products"
      />
      <ProductSection
        title="Laptops for You"
        products={electronics}
        viewAllHref="/products?category=laptops"
      />
      <ProductSection
        title="Fashion Picks"
        products={fashion}
        viewAllHref="/products?category=fashion"
      />
      <ProductSection
        title="Speakers & Audio"
        products={home}
        viewAllHref="/products?category=speakers"
      />
    </div>
  );
}

export default Home;
