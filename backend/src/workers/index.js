const cron = require('node-cron');
const { pool } = require('../config/db');
const { closeAuction } = require('../modules/auctions/auctions.service');
const { publishEvent } = require('../redis');

const startWorkers = () => {
  // Run every 10 seconds
  cron.schedule('*/10 * * * * *', async () => {
    const client = await pool.connect();
    try {
      // 1. Auction Starter
      const toStartRes = await client.query(
        `SELECT id, tenant_id FROM auctions 
         WHERE start_time <= NOW() AND status = 'upcoming'`
      );

      for (const row of toStartRes.rows) {
        await client.query(`UPDATE auctions SET status = 'live' WHERE id = $1`, [row.id]);
        await publishEvent(`auction:${row.id}`, {
          type: 'auction.started',
          auctionId: row.id,
          timestamp: new Date().toISOString()
        });
        console.log(`Worker: Started auction ${row.id}`);
      }

      // 2. Auction Closer
      const toCloseRes = await client.query(
        `SELECT id, tenant_id FROM auctions 
         WHERE end_time <= NOW() AND status = 'live'`
      );

      for (const row of toCloseRes.rows) {
        // Reuse the robust closing logic from auctions.service
        const result = await closeAuction(row.tenant_id, row.id);
        if (result) {
          console.log(`Worker: Closed auction ${row.id}`);
        }
      }

    } catch (err) {
      console.error('Worker error:', err);
    } finally {
      client.release();
    }
  });

  console.log('Background workers started (cron running every 10s)');
};

module.exports = {
  startWorkers,
};
