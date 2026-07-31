// Catches requests to routes that don't exist and forwards a 404 to the
// central error handler below.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error handler. Every controller either throws or calls next(err)
// and execution ends up here, guaranteeing one consistent JSON error shape:
// { success: false, message: "..." }
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  // Sequelize unique constraint violation (e.g. signup with an email already in use)
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    const field = err.errors?.[0]?.path || 'field';
    message = err.errors?.[0]?.message || `An account with this ${field} already exists`;
  }

  // Sequelize model validation errors (equivalent of Mongoose ValidationError)
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map((val) => val.message).join(', ');
  }

  // Malformed database-level errors (bad foreign keys, etc.)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to a related record';
  }

  // Malformed JWTs
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token, please log in again';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
