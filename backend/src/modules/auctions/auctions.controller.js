const asyncHandler = require('../../utils/asyncHandler');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const auctionsService = require('./auctions.service');

const createAuction = asyncHandler(async (req, res) => {
  const { productId, seatId, startTime, endTime, startingPrice } = req.body;
  const { tenantId } = req.user;

  const auction = await auctionsService.createAuction({
    tenantId,
    productId,
    seatId,
    startTime,
    endTime,
    startingPrice
  });

  if (!auction) {
    return res.status(400).json(errorResponse('Invalid product or seat for tenant'));
  }

  res.status(201).json(successResponse(auction, 'Auction created successfully'));
});

const listAuctions = asyncHandler(async (req, res) => {
  const { tenantId } = req.user;
  const { status } = req.query;

  const auctions = await auctionsService.listAuctions(tenantId, status);
  res.status(200).json(successResponse(auctions));
});

const getAuction = asyncHandler(async (req, res) => {
  const { tenantId } = req.user;
  const { id } = req.params;

  const auction = await auctionsService.getAuction(tenantId, id);
  if (!auction) return res.status(404).json(errorResponse('Auction not found'));

  res.status(200).json(successResponse(auction));
});

const getAuctionBids = asyncHandler(async (req, res) => {
  const { tenantId } = req.user;
  const { id } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50;
  const offset = parseInt(req.query.offset, 10) || 0;

  const bids = await auctionsService.getAuctionBids(tenantId, id, limit, offset);
  res.status(200).json(successResponse(bids));
});

const closeAuction = asyncHandler(async (req, res) => {
  const { tenantId } = req.user;
  const { id } = req.params;

  const result = await auctionsService.closeAuction(tenantId, id);
  if (!result) return res.status(404).json(errorResponse('Auction not found or cannot be closed'));

  res.status(200).json(successResponse(result, 'Auction closed'));
});

module.exports = {
  createAuction,
  listAuctions,
  getAuction,
  getAuctionBids,
  closeAuction
};
