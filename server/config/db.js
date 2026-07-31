const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

// SQLite stores the entire database in a single file on disk.
// Location is configurable via SQLITE_STORAGE (defaults to backend/data/flipkart.sqlite).
const storagePath =
  process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'flipkart.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: process.env.SQL_LOGGING === 'true' ? console.log : false,
});

// Connects to the SQLite file, verifies the connection, and creates any
// tables that don't exist yet. Existing data/tables are left untouched.
const connectDB = async () => {
  try {
    const dir = path.dirname(storagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await sequelize.authenticate();
    console.log(`SQLite connected: ${storagePath}`);

    // Auto-create tables on startup (no destructive changes to existing data).
    await sequelize.sync();
    console.log('Database synced (tables ensured).');
  } catch (error) {
    console.error(`SQLite connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
