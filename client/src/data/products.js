// Category metadata for the nav bar and product filters.
// NOTE: product data itself no longer lives here — it's fetched from the
// backend API via src/services/productService.js. This file only keeps the
// small, static (icon + label) UI config that CategoryBar/Products need.
// Category ids match (case-insensitively) the `category` field seeded into
// the backend's Product collection.
export const categories = [
  { id: 'smartphones', label: 'Smartphones', icon: '📱' },
  { id: 'laptops', label: 'Laptops', icon: '💻' },
  { id: 'headphones', label: 'Headphones', icon: '🎧' },
  { id: 'watches', label: 'Watches', icon: '⌚' },
  { id: 'cameras', label: 'Cameras', icon: '📷' },
  { id: 'tablets', label: 'Tablets', icon: '📔' },
  { id: 'tvs', label: 'TVs', icon: '📺' },
  { id: 'speakers', label: 'Speakers', icon: '🔊' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
];
