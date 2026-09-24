const { errorResponse } = require('../utils/apiResponse');

/**
 * TODO for Teammate 1: Implement Role checking
 * 
 * Contract:
 * Accepts an array of allowed roles. Checks if req.user.role is in the array.
 * If not, return 403 Forbidden.
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // STUB: implement role checking
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json(errorResponse('Forbidden: Insufficient permissions'));
    }
    next();
  };
};

module.exports = roleMiddleware;
