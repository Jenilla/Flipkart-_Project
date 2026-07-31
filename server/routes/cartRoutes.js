const express = require('express');
const {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/increase/:id', increaseQuantity);
router.put('/decrease/:id', decreaseQuantity);
router.delete('/remove/:id', removeItem);
router.delete('/clear', clearCart);

module.exports = router;
