const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const schema = require('./auth.schema');
const { authMiddleware, requireRole } = require('../../middleware/authMiddleware');
const { authRateLimiter } = require('../../middleware/rateLimiter');

router.post('/signup/create-org', authRateLimiter, validate(schema.createOrgSchema), authController.createOrg);
router.post('/signup/bidder', authRateLimiter, authController.signupBidder);
router.post('/signup/join-org', authRateLimiter, validate(schema.joinOrgSchema), authController.joinOrg);
router.post('/login', authRateLimiter, validate(schema.loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/me', authMiddleware, authController.getMe);
router.post('/invites', authMiddleware, requireRole(['tenant_admin', 'admin']), validate(schema.inviteSchema), authController.createInvite);

module.exports = router;
