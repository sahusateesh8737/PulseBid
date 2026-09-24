/**
 * Standardized API response format
 */

const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

const errorResponse = (message = 'Error', errors = null) => {
  return {
    success: false,
    message,
    errors,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
