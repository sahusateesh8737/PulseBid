const autocannon = require('autocannon');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

const runLoadTest = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 1. Seed data for the load test
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const userId = '22222222-2222-2222-2222-222222222222';
  const productId = '33333333-3333-3333-3333-333333333333';
  const auctionId = '44444444-4444-4444-4444-444444444444';
  const seatId = '55555555-5555-5555-5555-555555555555';

  await pool.query(`INSERT INTO tenants (id, name) VALUES ($1, 'LoadTest Tenant') ON CONFLICT DO NOTHING`, [tenantId]);
  await pool.query(`INSERT INTO users (id, tenant_id, email, password_hash) VALUES ($1, $2, 'test@test.com', 'hash') ON CONFLICT DO NOTHING`, [userId, tenantId]);
  await pool.query(`INSERT INTO products (id, tenant_id, title, starting_price) VALUES ($1, $2, 'Test Prod', 10) ON CONFLICT DO NOTHING`, [productId, tenantId]);
  
  // Clean up any previous test state for this auction
  await pool.query(`DELETE FROM bids WHERE auction_id = $1`, [auctionId]);
  await pool.query(`DELETE FROM seats WHERE auction_id = $1`, [auctionId]);
  await pool.query(`DELETE FROM auctions WHERE id = $1`, [auctionId]);

  await pool.query(`INSERT INTO auctions (id, tenant_id, product_id, start_time, end_time, status) VALUES ($1, $2, $3, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '1 hour', 'live')`, [auctionId, tenantId, productId]);
  await pool.query(`INSERT INTO seats (id, auction_id, current_bid, version) VALUES ($1, $2, 10, 0)`, [seatId, auctionId]);

  // Generate a mock JWT for the test
  // In a real scenario, teammate 1 issues this, but we'll manually sign it here.
  // Wait, our mock middleware right now overrides req.user, so the JWT might not strictly be needed, 
  // BUT let's assume we pass the auth layer anyway.
  
  console.log('Seeded database. Starting load test...');

  let bidAmountCounter = 11;

  const instance = autocannon({
    url: 'http://localhost:4000',
    connections: 200,
    pipelining: 1,
    duration: 10, // seconds
    requests: [
      {
        method: 'POST',
        path: `/api/v1/bids/${auctionId}`,
        headers: {
          'Content-type': 'application/json',
          // 'Authorization': `Bearer ${token}` // If using real auth middleware
        },
        setupRequest: (req, context) => {
          req.body = JSON.stringify({
            amount: bidAmountCounter++, // Increasing amounts
            idempotencyKey: `k6-load-test-${bidAmountCounter}` // Unique key per attempt
          });
          return req;
        }
      }
    ]
  });

  autocannon.track(instance, { renderProgressBar: true });

  instance.on('done', async (result) => {
    console.log('\\n--- LOAD TEST RESULTS ---');
    console.log(result);

    // Verify DB state
    const seatRes = await pool.query('SELECT current_bid, current_bidder_id, version FROM seats WHERE id = $1', [seatId]);
    const bidsRes = await pool.query('SELECT COUNT(*) as cnt, MAX(amount) as max_bid FROM bids WHERE auction_id = $1', [auctionId]);
    
    console.log('\\n--- POST-TEST DB VERIFICATION ---');
    console.log('Final Seat State:', seatRes.rows[0]);
    console.log('Bids Table Aggregates:', bidsRes.rows[0]);
    
    if (parseFloat(seatRes.rows[0].current_bid) === parseFloat(bidsRes.rows[0].max_bid)) {
      console.log('✅ PASS: Final seat current_bid perfectly matches highest bid in bids table.');
    } else {
      console.log('❌ FAIL: current_bid mismatch!');
    }

    await pool.end();
  });
};

runLoadTest().catch(console.error);
