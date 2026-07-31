const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../config/db');
const { withMongoStyleJSON } = require('./modelHelpers');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // Stored as JSON (SQLite has no native object/embedded-document type).
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
    itemsPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    discount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    deliveryCharge: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM('Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      defaultValue: 'Placed',
    },
    paymentMethod: {
      type: DataTypes.ENUM('COD', 'Card', 'UPI'),
      defaultValue: 'COD',
    },
  },
  {
    tableName: 'Orders',
    timestamps: true, // matches the Mongoose schema's { timestamps: true }
    indexes: [{ fields: ['userId', 'createdAt'] }],
  }
);

withMongoStyleJSON(Order);

module.exports = Order;
