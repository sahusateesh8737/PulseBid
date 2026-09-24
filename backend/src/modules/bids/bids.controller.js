const asyncHandler = require('../../utils/asyncHandler');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const bidsService = require('./bids.service');
const crypto = require('crypto');
const { bidRequestDuration } = require('../../metrics/metrics');

const placeBid = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const { amount, idempotencyKey } = req.body;
  const { userId, tenantId } = req.user;

  if (!amount) {
    return res.status(400).json(errorResponse('Amount is required'));
  }

  // Auto-generate idempotency key if not provided (though clients should provide it)
  const safeIdempotencyKey = idempotencyKey || crypto.randomUUID();
  const requestId = crypto.randomUUID();

  const endTimer = bidRequestDuration.labels(tenantId).startTimer();
  const start = process.hrtime.bigint(); // For latency tracking

  const result = await bidsService.placeBid({
    tenantId,
    userId,
    auctionId,
    amount,
    idempotencyKey: safeIdempotencyKey,
    requestId
  });

  const end = process.hrtime.bigint();
  const latencyMs = Number(end - start) / 1000000;
  console.log(`Bid processing latency: ${latencyMs.toFixed(2)}ms`);

  endTimer();

  if (!result.success) {
    return res.status(result.status || 400).json(errorResponse(result.message));
  }

  res.status(201).json(successResponse(result.data, 'Bid placed successfully'));
});

module.exports = {
  placeBid,
};
