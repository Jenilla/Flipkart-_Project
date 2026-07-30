import api from './api.js';

// The existing UI components (ProductCard, Products, Home, ProductDetails, Cart)
// were built against this shape: { id, name, category, price, originalPrice,
// rating, ratingCount, availability, image, description }.
// The backend returns { _id, title, ... } plus computed virtuals
// (originalPrice, availability). This mapper bridges the two so none of the
// existing component/JSX code has to change.
export const mapProduct = (product) => ({
  id: product._id,
  name: product.title,
  category: product.category,
  brand: product.brand,
  price: product.price,
  originalPrice: product.originalPrice,
  rating: product.rating,
  ratingCount: product.ratingCount,
  availability: product.availability,
  image: product.image,
  description: product.description,
  stock: product.stock,
});

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return {
    products: (data.products || []).map(mapProduct),
    total: data.total,
    page: data.page,
    pages: data.pages,
  };
};

export const fetchProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return mapProduct(data.product);
  } catch {
    return null;
  }
};

export const fetchCategories = async () => {
  try {
    const { data } = await api.get('/products/categories/list');
    return data.categories || [];
  } catch {
    return [];
  }
};

export const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};
