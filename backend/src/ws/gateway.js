const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { pool } = require('../config/db');
const { subClient } = require('../redis');
const { websocketActiveConnections, register } = require('../metrics/metrics');

// In-memory mapping of channel to Set of WebSocket clients
const subscriptions = new Map();

const handleRedisMessage = (channel, message) => {
  const clients = subscriptions.get(channel);
  if (clients) {
    for (const client of clients) {
      if (client.readyState === 1 /* ws.OPEN */) {
        client.send(message);
      }
    }
  }
};

const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Listen to redis pub/sub globally for this instance
  subClient.pSubscribe('auction:*', (message, channel) => {
    handleRedisMessage(channel, message);
  });

  wss.on('connection', async (ws, req) => {
    console.log('New WebSocket connection attempt:', req.url);
    ws.isAlive = true;
    websocketActiveConnections.inc();
    ws.on('pong', () => { ws.isAlive = true; });

    try {
      // 1. Authenticate via token in query string: ws://localhost:4000/ws?token=XYZ
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      
      if (!token) {
        console.log('WS Connection rejected: No token provided');
        ws.close(4001, 'Unauthorized: No token provided');
        return;
      }

      // We assume the token payload contains userId and tenantId
      const decoded = jwt.verify(token, env.JWT_SECRET);
      ws.user = {
        userId: decoded.userId,
        tenantId: decoded.tenantId,
        role: decoded.role
      };
      console.log('WS Connection authenticated for user:', ws.user.userId);
    } catch (err) {
      console.error('WS Connection rejected: Invalid token', err.message);
      ws.close(4001, 'Unauthorized: Invalid token');
      return;
    }

    ws.on('message', async (messageData) => {
      try {
        const msg = JSON.parse(messageData);
        if (msg.action === 'subscribe' && msg.auctionId) {
          const auctionId = msg.auctionId;
          
          // Verify auction belongs to tenant
          const res = await pool.query(
            'SELECT id FROM auctions WHERE id = $1 AND tenant_id = $2',
            [auctionId, ws.user.tenantId]
          );

          if (res.rows.length === 0) {
            ws.send(JSON.stringify({ type: 'error', message: 'Auction not found or unauthorized' }));
            return;
          }

          const channel = `auction:${auctionId}`;
          if (!subscriptions.has(channel)) {
            subscriptions.set(channel, new Set());
          }
          subscriptions.get(channel).add(ws);
          ws.subscribedChannels = ws.subscribedChannels || new Set();
          ws.subscribedChannels.add(channel);

          ws.send(JSON.stringify({ type: 'subscribed', auctionId }));
        }
      } catch (e) {
        console.error('WS message error', e);
      }
    });

    ws.on('close', () => {
      websocketActiveConnections.dec();
      // Cleanup subscriptions
      if (ws.subscribedChannels) {
        for (const channel of ws.subscribedChannels) {
          const clients = subscriptions.get(channel);
          if (clients) {
            clients.delete(ws);
            if (clients.size === 0) {
              subscriptions.delete(channel);
            }
          }
        }
      }
    });
  });

  // 5. Heartbeat every 30s
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
};

module.exports = {
  initWebSocket,
};

if (require.main === module) {
  const http = require('http');
  const server = http.createServer(async (req, res) => {
    if (req.url === '/metrics' && req.method === 'GET') {
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  const redisClient = require('../config/redis');
  (async () => {
    try {
      if (!redisClient.isOpen) await redisClient.connect();
      if (!subClient.isOpen) await subClient.connect();
    } catch (e) {
      console.error(e);
    }
    const PORT = env.PORT || 4001;
    server.on('upgrade', (req, socket, head) => {
      console.log('HTTP Upgrade request:', req.url, '— expected path: /ws');
    });
    server.listen(PORT, () => {
      console.log(`WS Gateway standalone server listening on port ${PORT}`);
    });
    initWebSocket(server);
  })();
}
