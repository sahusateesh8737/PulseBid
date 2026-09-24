const { errorResponse } = require('../utils/apiResponse');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Include stack trace only in development
  const errors = env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json(errorResponse(message, errors));
};

module.exports = errorHandler;
