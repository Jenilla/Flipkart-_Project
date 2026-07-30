const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// Builds a Mongoose query object from shared query-string filters so
// /api/products, /api/products/filter and /api/products/category/:category
// can all reuse the exact same filtering + sorting logic.
const buildQuery = (queryParams, extraFilters = {}) => {
  const { category, brand, minPrice, maxPrice, rating, search } = queryParams;
  const query = { ...extraFilters };

  if (category && category !== 'all') {
    query.category = { $regex: `^${category}$`, $options: 'i' };
  }

  if (brand) {
    query.brand = { $regex: `^${brand}$`, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  if (search) {
    const term = search.trim();
    if (term) {
      // Case-insensitive search across title, description, brand and category
      const regex = { $regex: term, $options: 'i' };
      query.$or = [
        { title: regex },
        { description: regex },
        { brand: regex },
        { category: regex },
      ];
    }
  }

  return query;
};

const buildSort = (sort) => {
  switch (sort) {
    case 'price-low-high':
      return { price: 1 };
    case 'price-high-low':
      return { price: -1 };
    case 'newest':
      return { createdAt: -1 };
    case 'rating':
      return { rating: -1 };
    default:
      return { createdAt: -1 };
  }
};

// @desc    Get all products (supports search, filter, sort, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort } = req.query;
  const query = buildQuery(req.query);

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(buildSort(sort)).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({ success: true, product });
});

// @desc    Search products by title, brand, category or description (case-insensitive)
// @route   GET /api/products/search?q=term
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const term = (req.query.q || req.query.search || '').trim();

  if (!term) {
    res.status(200).json({ success: true, count: 0, products: [] });
    return;
  }

  const regex = { $regex: term, $options: 'i' };
  const products = await Product.find({
    $or: [{ title: regex }, { description: regex }, { brand: regex }, { category: regex }],
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Get products belonging to one category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const query = buildQuery(req.query, {
    category: { $regex: `^${req.params.category}$`, $options: 'i' },
  });

  const products = await Product.find(query).sort(buildSort(req.query.sort));
  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Filter products by category / price range / brand / rating with sorting
// @route   GET /api/products/filter
// @access  Public
const filterProducts = asyncHandler(async (req, res) => {
  const query = buildQuery(req.query);
  const products = await Product.find(query).sort(buildSort(req.query.sort));
  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    List distinct categories currently in the catalog
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.status(200).json({ success: true, categories });
});

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  filterProducts,
  getCategories,
};
