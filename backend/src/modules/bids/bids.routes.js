const express = require('express');
const router = express.Router();
const bidsController = require('./bids.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

// Endpoint: /api/v1/auctions/:id/bids (mounted on /api/v1/bids in app.js? wait, if it's /api/v1/auctions/:id/bids, it should be mounted in auctions routes! 
// Let's adjust this: in app.js it's mounted as /api/v1/bids, so the path here would just be /:auctionId
router.post('/:auctionId', bidsController.placeBid);

module.exports = router;
