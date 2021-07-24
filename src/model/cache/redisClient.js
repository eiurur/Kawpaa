const path = require('path');
const bluebird = require('bluebird');
const redis = require('redis');

require('dotenv').config();

let redisClient = null;
if (process.env.REDIS_URI) {
  redisClient = redis.createClient(process.env.REDIS_URI);
} else {
  redisClient = redis.createClient();
}
if (process.env.REDIS_PASSWORD) {
  redisClient.auth(process.env.REDIS_PASSWORD, (err) => {
    if (err) throw err;
  });
}

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = redisClient;
