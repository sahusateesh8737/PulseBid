const { pool } = require('../../config/db');
const { publishEvent } = require('../../redis');

const createAuction = async ({ tenantId, productId, seatId, startTime, endTime, startingPrice }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Validate product belongs to tenant
    const prodRes = await client.query('SELECT id FROM products WHERE id = $1 AND tenant_id = $2', [productId, tenantId]);
    if (prodRes.rows.length === 0) throw new Error('Product not found');

    const res = await client.query(
      `INSERT INTO auctions (tenant_id, product_id, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, 'upcoming') RETURNING *`,
      [tenantId, productId, startTime, endTime]
    );
    const auction = res.rows[0];

    // Create or assign seat if provided. If not provided, we create a default seat.
    // For this design, let's create a seat for the auction since bids are placed on seats.
    const seatRes = await client.query(
      `INSERT INTO seats (id, auction_id, status, current_bid, version) 
       VALUES (COALESCE($1, uuid_generate_v4()), $2, 'reserved', $3, 0) RETURNING *`,
      [seatId || null, auction.id, startingPrice]
    );

    await client.query('COMMIT');
    return { ...auction, seat: seatRes.rows[0] };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating auction', err);
    return null;
  } finally {
    client.release();
  }
};

const listAuctions = async (tenantId, status) => {
  let query = `
    SELECT a.*, s.id as seat_id, s.current_bid, s.current_bidder_id
    FROM auctions a
    LEFT JOIN seats s ON s.auction_id = a.id
    WHERE a.tenant_id = $1
  `;
  const params = [tenantId];
  if (status) {
    query += ` AND a.status = $2`;
    params.push(status);
  }
  query += ` ORDER BY a.created_at DESC`;

  const res = await pool.query(query, params);
  return res.rows;
};

const getAuction = async (tenantId, id) => {
  const query = `
    SELECT a.*, p.title as product_title, p.description, 
           s.id as seat_id, s.current_bid, s.current_bidder_id,
           (SELECT COUNT(*) FROM bids b WHERE b.auction_id = a.id) as bid_count
    FROM auctions a
    JOIN products p ON p.id = a.product_id
    LEFT JOIN seats s ON s.auction_id = a.id
    WHERE a.id = $1 AND a.tenant_id = $2
  `;
  const res = await pool.query(query, [id, tenantId]);
  return res.rows[0];
};

const getAuctionBids = async (tenantId, id, limit, offset) => {
  // First ensure auction belongs to tenant
  const authCheck = await pool.query('SELECT id FROM auctions WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
  if (authCheck.rows.length === 0) return null;

  const query = `
    SELECT b.id, b.user_id, b.amount, b.created_at
    FROM bids b
    WHERE b.auction_id = $1
    ORDER BY b.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const res = await pool.query(query, [id, limit, offset]);
  return res.rows;
};

const closeAuction = async (tenantId, auctionId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Verify ownership and get seat
    const auctionRes = await client.query(
      'SELECT a.*, s.id as seat_id, s.current_bidder_id FROM auctions a LEFT JOIN seats s ON s.auction_id = a.id WHERE a.id = $1 AND a.tenant_id = $2 AND a.status = $3 FOR UPDATE',
      [auctionId, tenantId, 'live']
    );
    
    if (auctionRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    const auction = auctionRes.rows[0];

    // Close auction
    await client.query('UPDATE auctions SET status = $1 WHERE id = $2', ['closed', auctionId]);
    
    // Mark seat as sold
    if (auction.seat_id) {
      await client.query('UPDATE seats SET status = $1 WHERE id = $2', ['sold', auction.seat_id]);
    }

    await client.query('COMMIT');

    // Publish event
    await publishEvent(`auction:${auctionId}`, {
      type: 'auction.closed',
      auctionId,
      winnerId: auction.current_bidder_id,
      timestamp: new Date().toISOString()
    });

    return { auctionId, status: 'closed', winnerId: auction.current_bidder_id };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error closing auction', err);
    return null;
  } finally {
    client.release();
  }
};

module.exports = {
  createAuction,
  listAuctions,
  getAuction,
  getAuctionBids,
  closeAuction
};
