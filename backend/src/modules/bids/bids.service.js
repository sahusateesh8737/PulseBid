const { pool } = require('../../config/db');
const { acquireLock, releaseLock, publishEvent } = require('../../redis');
const { bidRejectedCounter } = require('../../metrics/metrics');

const placeBid = async ({ tenantId, userId, auctionId, amount, idempotencyKey, requestId }) => {
  // First, get the seatId for this auction (Fast read)
  const seatRes = await pool.query(
    `SELECT s.id as seat_id, a.status 
     FROM seats s 
     JOIN auctions a ON a.id = s.auction_id 
     WHERE a.id = $1`,
    [auctionId]
  );

  if (seatRes.rows.length === 0) {
    return { success: false, status: 404, message: 'Auction or seat not found' };
  }

  const { seat_id: seatId, status: auctionStatus } = seatRes.rows[0];

  if (auctionStatus !== 'live') {
    bidRejectedCounter.labels('auction_not_live', tenantId).inc();
    return { success: false, status: 400, message: 'Auction is not live' };
  }

  // LAYER 1: Redis distributed lock
  const lockKey = `lock:seat:${seatId}`;
  const locked = await acquireLock(lockKey, requestId, 3000);
  if (!locked) {
    bidRejectedCounter.labels('lock_held', tenantId).inc();
    return { success: false, status: 409, message: 'A higher bid is being processed, please retry' };
  }

  const client = await pool.connect();
  try {
    // LAYER 2: Postgres atomic transaction
    await client.query('BEGIN');

    // 1. SELECT FOR UPDATE
    const lockedSeatRes = await client.query(
      'SELECT current_bid, version FROM seats WHERE id = $1 FOR UPDATE',
      [seatId]
    );
    const { current_bid, version } = lockedSeatRes.rows[0];

    // 2. Business logic check
    if (parseFloat(amount) <= parseFloat(current_bid)) {
      await client.query('ROLLBACK');
      bidRejectedCounter.labels('bid_too_low', tenantId).inc();
      return { success: false, status: 409, message: 'Bid too low' };
    }

    // 3. Idempotency check
    const existingBidRes = await client.query(
      'SELECT id, amount, created_at FROM bids WHERE idempotency_key = $1 FOR UPDATE',
      [idempotencyKey]
    );
    if (existingBidRes.rows.length > 0) {
      await client.query('ROLLBACK');
      bidRejectedCounter.labels('duplicate_idempotency_key', tenantId).inc();
      // Return the previous result
      return { success: true, data: existingBidRes.rows[0] };
    }

    // 4. Update seats with optimistic concurrency control (versioning)
    const updateSeatRes = await client.query(
      `UPDATE seats 
       SET current_bid = $1, current_bidder_id = $2, version = version + 1 
       WHERE id = $3 AND version = $4 
       RETURNING current_bid, version`,
      [amount, userId, seatId, version]
    );

    if (updateSeatRes.rowCount === 0) {
      // Concurrent update happened outside our lock (or version mismatch)
      await client.query('ROLLBACK');
      return { success: false, status: 409, message: 'Concurrent modification error, please retry' };
    }

    // 5. Insert bid
    const insertBidRes = await client.query(
      `INSERT INTO bids (auction_id, user_id, amount, idempotency_key) 
       VALUES ($1, $2, $3, $4) RETURNING id, amount, created_at`,
      [auctionId, userId, amount, idempotencyKey]
    );

    await client.query('COMMIT');

    const newBid = insertBidRes.rows[0];

    // LAYER 3: Publish the confirmed event AFTER commit succeeds
    await publishEvent(`auction:${auctionId}`, {
      type: 'bid.placed',
      auctionId,
      amount,
      bidderId: userId,
      timestamp: new Date().toISOString()
    });

    return { success: true, data: newBid };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bid placement error', error);
    return { success: false, status: 500, message: 'Internal server error' };
  } finally {
    client.release();
    // Always release the lock
    await releaseLock(lockKey, requestId);
  }
};

module.exports = {
  placeBid,
};
