const { errorResponse } = require('../utils/apiResponse');

/**
 * TODO for Teammate 1: Implement JWT verification
 * 
 * Contract:
 * If valid, this middleware must attach the decoded user object to req.user:
 * req.user = {
 *   userId: '123',
 *   tenantId: 'abc',
 *   role: 'user' // or 'admin', etc.
 * }
 * 
 * If invalid or missing, it should return an error using errorResponse().
 */
const authMiddleware = (req, res, next) => {
  // STUB: Replace with actual JWT logic
  req.user = {
    userId: 'stub-user-id',
    tenantId: 'stub-tenant-id',
    role: 'user',
  };
  next();
};

module.exports = authMiddleware;
