const client = require('prom-client');

// Default Registry
const register = new client.Registry();

// Enable default Node.js metrics
client.collectDefaultMetrics({ register });

// 1. httpRequestDuration
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2],
  registers: [register]
});

// 2. bidRequestDuration
const bidRequestDuration = new client.Histogram({
  name: 'bid_request_duration_seconds',
  help: 'Duration of the bid placement transaction (Redis lock + Postgres transaction + publish)',
  labelNames: ['tenant_id'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [register]
});

// 3. bidRejectedCounter
const bidRejectedCounter = new client.Counter({
  name: 'bid_rejected_total',
  help: 'Total number of rejected bids',
  labelNames: ['reason', 'tenant_id'],
  registers: [register]
});

// 4. redisLockAcquisitionCounter
const redisLockAcquisitionCounter = new client.Counter({
  name: 'redis_lock_acquisition_total',
  help: 'Total Redis SET NX lock attempts for bidding',
  labelNames: ['result'],
  registers: [register]
});

// 5. websocketActiveConnections
const websocketActiveConnections = new client.Gauge({
  name: 'websocket_active_connections',
  help: 'Current active WebSocket connections',
  registers: [register]
});

// 6. websocketMessagesPublished
const websocketMessagesPublished = new client.Counter({
  name: 'websocket_messages_published_total',
  help: 'Total messages published to Redis Pub/Sub',
  labelNames: ['event_type'],
  registers: [register]
});

// Middleware to track HTTP request duration
const httpMetricsMiddleware = (req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    
    let route = req.route ? req.route.path : req.path;
    // Basic route sanitization for common paths (e.g. replacing UUIDs with :id)
    if (route.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) {
      route = route.replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, ':id');
    }

    httpRequestDuration.labels(req.method, route, res.statusCode).observe(durationInSeconds);
  });
  next();
};

module.exports = {
  register,
  httpRequestDuration,
  bidRequestDuration,
  bidRejectedCounter,
  redisLockAcquisitionCounter,
  websocketActiveConnections,
  websocketMessagesPublished,
  httpMetricsMiddleware
};
