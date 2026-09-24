const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/db');
const redisClient = require('./config/redis');
const { initWebSocket } = require('./ws/gateway');

const PORT = env.PORT || 4000;

// Connect to Redis first, then start the server
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error('Failed to connect to Redis during startup', err);
  }
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    console.log('✅ Connected to database pool and Redis');
  });

  // Initialize WebSocket Server on the same port
  initWebSocket(server);

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(async () => {
      console.log('HTTP server closed');
      try {
        await pool.end();
        console.log('DB pool closed');
        if (redisClient.isOpen) {
          await redisClient.quit();
          console.log('Redis client disconnected');
        }
        process.exit(0);
      } catch (err) {
        console.error('Error during graceful shutdown', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
})();
