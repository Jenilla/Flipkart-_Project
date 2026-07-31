const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../config/db');
const { withMongoStyleJSON } = require('./modelHelpers');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    // FK column is declared explicitly here (in addition to the association
    // in models/index.js) purely for readability / unique constraint.
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'Carts',
    timestamps: true, // matches the Mongoose schema's { timestamps: true }
  }
);

withMongoStyleJSON(Cart);

module.exports = Cart;
