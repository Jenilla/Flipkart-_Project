const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Relational equivalent of the embedded `items: [cartItemSchema]` array on
// the old Mongoose Cart document. One row per product in a user's cart.
const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: { args: [1], msg: 'Quantity must be at least 1' } },
    },
  },
  {
    tableName: 'CartItems',
    timestamps: false,
    indexes: [{ unique: true, fields: ['cartId', 'productId'] }],
  }
);

module.exports = CartItem;
