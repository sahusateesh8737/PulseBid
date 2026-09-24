const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const env = require('./config/env');
const { pool } = require('./config/db');
const redisClient = require('./config/redis');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { register, httpMetricsMiddleware } = require('./metrics/metrics');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const auctionsRoutes = require('./modules/auctions/auctions.routes');
const bidsRoutes = require('./modules/bids/bids.routes');
const uploadRoutes = require('./modules/upload/upload.routes');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(httpMetricsMiddleware);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check route
app.get('/api/v1/health', async (req, res, next) => {
  try {
    const dbRes = await pool.query('SELECT 1 as is_alive');
    const redisPing = await redisClient.ping();
    
    res.status(200).json({
      status: 'ok',
      db: dbRes.rows[0].is_alive === 1 ? 'connected' : 'error',
      redis: redisPing === 'PONG' ? 'connected' : 'error',
    });
  } catch (error) {
    next(error);
  }
});

// Mount modular routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', inventoryRoutes);
app.use('/api/v1/auctions', auctionsRoutes);
app.use('/api/v1/auctions', bidsRoutes);
app.use('/api/v1/upload', uploadRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
