const Redis = require('ioredis');
const logger = require('./logger');

/**
 * Thin cache wrapper. Uses Redis when reachable, and transparently
 * falls back to an in-memory Map when Redis is not configured/available
 * (handy for local dev without Docker/Redis running).
 */
class CacheClient {
  constructor() {
    this.memoryStore = new Map();
    this.useRedis = false;
    this.client = null;

    const url = process.env.REDIS_URL;
    if (url) {
      this.client = new Redis(url, {
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // don't keep retrying forever
        lazyConnect: true,
      });

      this.client
        .connect()
        .then(() => {
          this.useRedis = true;
          logger.info('Connected to Redis cache.');
        })
        .catch((err) => {
          this.useRedis = false;
          logger.warn(`Redis unavailable (${err.message}); falling back to in-memory cache.`);
        });

      this.client.on('error', () => {
        this.useRedis = false;
      });
    } else {
      logger.warn('REDIS_URL not set; using in-memory cache.');
    }
  }

  async get(key) {
    if (this.useRedis) {
      const val = await this.client.get(key);
      return val ? JSON.parse(val) : null;
    }
    const entry = this.memoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.memoryStore.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, ttlSeconds = 300) {
    if (this.useRedis) {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }
    this.memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async del(key) {
    if (this.useRedis) {
      await this.client.del(key);
      return;
    }
    this.memoryStore.delete(key);
  }
}

module.exports = new CacheClient();
