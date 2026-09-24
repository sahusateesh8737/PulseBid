const { WebSocketServer } = require('ws');

/**
 * STUB: WebSocket Server Bootstrap
 * To be implemented by Teammate 2
 */
const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    ws.send('WS Connected');
  });

  return wss;
};

module.exports = {
  initWebSocket,
};
