const express = require('express');
const {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  filterProducts,
  getCategories,
} = require('../controllers/productController');

const router = express.Router();

// NOTE: specific/static routes must be declared before the "/:id" route
router.get('/search', searchProducts);
router.get('/filter', filterProducts);
router.get('/categories/list', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/', getProducts);

module.exports = router;
