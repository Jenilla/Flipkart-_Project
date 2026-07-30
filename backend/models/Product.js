const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 90,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index to support case-insensitive search across title, description, brand, category
productSchema.index({ title: 'text', description: 'text', brand: 'text', category: 'text' });
// Compound indexes for common filter/sort access patterns
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Virtual: original (pre-discount) price, useful for the frontend's "MRP" display
productSchema.virtual('originalPrice').get(function getOriginalPrice() {
  if (!this.discount || this.discount <= 0) return this.price;
  return Math.round(this.price / (1 - this.discount / 100));
});

// Virtual: simple availability label the frontend already knows how to render
productSchema.virtual('availability').get(function getAvailability() {
  if (this.stock <= 0) return 'Out of Stock';
  if (this.stock <= 5) return `Only ${this.stock} left`;
  return 'In Stock';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
