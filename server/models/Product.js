const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../config/db');
const { withMongoStyleJSON } = require('./modelHelpers');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Product title is required' } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: 'Product description is required' } },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Product price is required' },
        min: { args: [0], msg: 'Price cannot be negative' },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Product category is required' } },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Product brand is required' } },
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: { min: 0, max: 90 },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: { msg: 'Product stock is required' },
        min: 0,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Product image is required' } },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // ---- Virtuals (computed, not stored) ----
    originalPrice: {
      type: DataTypes.VIRTUAL,
      get() {
        const discount = this.getDataValue('discount');
        const price = this.getDataValue('price');
        if (!discount || discount <= 0) return price;
        return Math.round(price / (1 - discount / 100));
      },
    },
    availability: {
      type: DataTypes.VIRTUAL,
      get() {
        const stock = this.getDataValue('stock');
        if (stock <= 0) return 'Out of Stock';
        if (stock <= 5) return `Only ${stock} left`;
        return 'In Stock';
      },
    },
  },
  {
    tableName: 'Products',
    timestamps: false,
    indexes: [
      { fields: ['category'] },
      { fields: ['brand'] },
      { fields: ['price'] },
      { fields: ['rating'] },
      { fields: ['createdAt'] },
    ],
  }
);

withMongoStyleJSON(Product);

module.exports = Product;
