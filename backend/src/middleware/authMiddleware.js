const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Validates JWT from Authorization header and attaches payload to req.user
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized, missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized, invalid token' });
  }
};

/**
 * Validates role based on req.user.role array
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden, insufficient permissions');
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
