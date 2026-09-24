const express = require('express');
const router = express.Router();
const bidsController = require('./bids.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

// Endpoint: /api/v1/auctions/:auctionId/bids
router.post('/:auctionId/bids', bidsController.placeBid);

module.exports = router;
