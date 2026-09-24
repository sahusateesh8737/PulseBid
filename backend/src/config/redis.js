const Redis = require('redis');
const env = require('./env');

const redisClient = Redis.createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected'));

module.exports = redisClient;
