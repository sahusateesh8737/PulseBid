const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/apiResponse');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  handler: (req, res, next, options) => {
    return res.status(429).json(errorResponse('Too many requests from this IP, please try again after 15 minutes'));
  }
});

module.exports = { authRateLimiter };
