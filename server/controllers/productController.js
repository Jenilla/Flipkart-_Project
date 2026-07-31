const asyncHandler = require('express-async-handler');
const { Op, fn, col, where: sequelizeWhere } = require('sequelize');
const { Product } = require('../models');

// Case-insensitive equality check (SQLite has no native $regex ^...$
// operator, so an exact case-insensitive match is done via lower()).
const iEquals = (field, value) => sequelizeWhere(fn('lower', col(field)), String(value).toLowerCase());

// Builds a Sequelize `where` clause from shared query-string filters so
// /api/products, /api/products/filter and /api/products/category/:category
// can all reuse the exact same filtering + sorting logic.
const buildQuery = (queryParams, extraFilters = {}) => {
  const { category, brand, minPrice, maxPrice, rating, search } = queryParams;
  const conditions = [];

  // A category passed in the query string always wins over one supplied via
  // extraFilters (e.g. the fixed :category route param), matching the
  // original filter-building behaviour.
  let categoryFilter = extraFilters.category;
  if (category && category !== 'all') {
    categoryFilter = category;
  }
  if (categoryFilter) {
    conditions.push(iEquals('category', categoryFilter));
  }

  Object.entries(extraFilters).forEach(([key, value]) => {
    if (key !== 'category') conditions.push({ [key]: value });
  });

  if (brand) {
    conditions.push(iEquals('brand', brand));
  }

  if (minPrice || maxPrice) {
    const priceCondition = {};
    if (minPrice) priceCondition[Op.gte] = Number(minPrice);
    if (maxPrice) priceCondition[Op.lte] = Number(maxPrice);
    conditions.push({ price: priceCondition });
  }

  if (rating) {
    conditions.push({ rating: { [Op.gte]: Number(rating) } });
  }

  if (search) {
    const term = search.trim();
    if (term) {
      // Case-insensitive search across title, description, brand and category
      conditions.push({
        [Op.or]: [
          { title: { [Op.like]: `%${term}%` } },
          { description: { [Op.like]: `%${term}%` } },
          { brand: { [Op.like]: `%${term}%` } },
          { category: { [Op.like]: `%${term}%` } },
        ],
      });
    }
  }

  return conditions.length ? { [Op.and]: conditions } : {};
};

const buildSort = (sort) => {
  switch (sort) {
    case 'price-low-high':
      return [['price', 'ASC']];
    case 'price-high-low':
      return [['price', 'DESC']];
    case 'newest':
      return [['createdAt', 'DESC']];
    case 'rating':
      return [['rating', 'DESC']];
    default:
      return [['createdAt', 'DESC']];
  }
};

// @desc    Get all products (supports search, filter, sort, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort } = req.query;
  const where = buildQuery(req.query);

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const offset = (pageNum - 1) * limitNum;

  const { count: total, rows: products } = await Product.findAndCountAll({
    where,
    order: buildSort(sort),
    offset,
    limit: limitNum,
  });

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
  const product = await Product.findByPk(req.params.id);

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

  const products = await Product.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${term}%` } },
        { description: { [Op.like]: `%${term}%` } },
        { brand: { [Op.like]: `%${term}%` } },
        { category: { [Op.like]: `%${term}%` } },
      ],
    },
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Get products belonging to one category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const where = buildQuery(req.query, { category: req.params.category });

  const products = await Product.findAll({ where, order: buildSort(req.query.sort) });
  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    Filter products by category / price range / brand / rating with sorting
// @route   GET /api/products/filter
// @access  Public
const filterProducts = asyncHandler(async (req, res) => {
  const where = buildQuery(req.query);
  const products = await Product.findAll({ where, order: buildSort(req.query.sort) });
  res.status(200).json({ success: true, count: products.length, products });
});

// @desc    List distinct categories currently in the catalog
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const rows = await Product.findAll({
    attributes: [[fn('DISTINCT', col('category')), 'category']],
    raw: true,
  });
  const categories = rows.map((row) => row.category);
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
