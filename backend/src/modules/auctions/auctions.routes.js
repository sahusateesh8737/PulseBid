const express = require('express');
const router = express.Router();
const auctionsController = require('./auctions.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');

// All auction routes require authentication
router.use(authMiddleware);

// Admin/Manager routes
router.post('/', roleMiddleware(['admin', 'manager']), auctionsController.createAuction);
router.patch('/:id/close', roleMiddleware(['admin', 'manager']), auctionsController.closeAuction);

// General routes
router.get('/', auctionsController.listAuctions);
router.get('/:id', auctionsController.getAuction);
router.get('/:id/bids', auctionsController.getAuctionBids);

module.exports = router;
