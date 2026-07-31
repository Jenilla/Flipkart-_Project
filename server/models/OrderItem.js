const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { withMongoStyleJSON } = require('./modelHelpers');

// Relational equivalent of the embedded `items: [orderItemSchema]` array on
// the old Mongoose Order document. A snapshot of product details is stored
// on each row (title/image/price) so historical orders stay accurate even
// if the product is later changed or deleted.
const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      // Nullable + SET NULL on delete: historical orders should survive a
      // product being removed from the catalog later.
      type: DataTypes.UUID,
      allowNull: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: 'Quantity must be at least 1' } },
    },
  },
  {
    tableName: 'OrderItems',
    timestamps: false,
  }
);

withMongoStyleJSON(OrderItem);
// Frontend/order responses reference the product via `item.product`
// (matching the old populated Mongoose ref) rather than `item.productId`.
const baseToJSON = OrderItem.prototype.toJSON;
OrderItem.prototype.toJSON = function toJSON() {
  const values = baseToJSON.call(this);
  values.product = values.productId;
  return values;
};

module.exports = OrderItem;
