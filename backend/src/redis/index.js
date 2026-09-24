const redisClient = require('../config/redis');
const { redisLockAcquisitionCounter, websocketMessagesPublished } = require('../metrics/metrics');

// Create separate clients for Pub/Sub
const pubClient = redisClient; // Can reuse main client for publishing
const subClient = pubClient.duplicate();

subClient.on('error', (err) => console.error('Redis SubClient Error', err));

// Connect sub client
(async () => {
  if (!subClient.isOpen) {
    await subClient.connect();
    console.log('Redis Subscriber connected');
  }
})();

/**
 * Acquire a distributed lock.
 * Returns true if lock acquired, false otherwise.
 */
const acquireLock = async (key, requestId, ttlMs = 3000) => {
  try {
    const result = await redisClient.set(key, requestId, {
      NX: true,
      PX: ttlMs,
    });
    const acquired = result === 'OK';
    redisLockAcquisitionCounter.labels(acquired ? 'acquired' : 'failed').inc();
    return acquired;
  } catch (error) {
    console.error('Lock acquisition error', error);
    return false;
  }
};

/**
 * Release a distributed lock.
 */
const releaseLock = async (key, requestId) => {
  try {
    // Basic release: strictly we should check if the value matches requestId using Lua,
    // but a simple DEL is often enough if TTL > execution time, 
    // though Lua is safer.
    const script = `
      if redis.call("get",KEYS[1]) == ARGV[1]
      then
          return redis.call("del",KEYS[1])
      else
          return 0
      end
    `;
    await redisClient.eval(script, {
      keys: [key],
      arguments: [requestId]
    });
  } catch (error) {
    console.error('Lock release error', error);
  }
};

/**
 * Publish event to a specific channel
 */
const publishEvent = async (channel, eventPayload) => {
  try {
    await pubClient.publish(channel, JSON.stringify(eventPayload));
    if (eventPayload && eventPayload.type) {
      websocketMessagesPublished.labels(eventPayload.type).inc();
    }
  } catch (error) {
    console.error(`Error publishing to channel ${channel}`, error);
  }
};

module.exports = {
  redisClient,
  pubClient,
  subClient,
  acquireLock,
  releaseLock,
  publishEvent,
};
