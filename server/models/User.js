const { DataTypes, UUIDV4 } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const { withMongoStyleJSON } = require('./modelHelpers');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: { args: [2, 60], msg: 'Name must be between 2 and 60 characters long' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'An account with this email already exists' },
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Please provide a valid email address' },
      },
      set(value) {
        this.setDataValue('email', value ? value.trim().toLowerCase() : value);
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: { args: [6, 255], msg: 'Password must be at least 6 characters long' },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Users',
    timestamps: false,
    hooks: {
      // Hash the password whenever it's set/changed, mirroring the
      // Mongoose pre('save') hook.
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    defaultScope: {
      // Mongoose's `select: false` on password is mirrored by excluding it
      // from the default query scope; use User.scope('withPassword') to
      // fetch it explicitly (e.g. during login).
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

// Compare a plaintext candidate password against the stored hash.
User.prototype.matchPassword = async function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never leak the password hash when the document is serialized, and mirror
// Mongoose's `_id` field for frontend/service-layer compatibility.
withMongoStyleJSON(User);
const baseToJSON = User.prototype.toJSON;
User.prototype.toJSON = function toJSON() {
  const values = baseToJSON.call(this);
  delete values.password;
  return values;
};

module.exports = User;
