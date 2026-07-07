const cache = require('../config/redis');

/**
 * Caches successful JSON responses for GET requests.
 * ttlSeconds: how long to keep the cached response.
 */
const cacheMiddleware = (ttlSeconds = 300) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await cache.get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }
  } catch (err) {
    // cache errors should never break the request
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, body, ttlSeconds).catch(() => {});
    }
    res.setHeader('X-Cache', 'MISS');
    return originalJson(body);
  };

  next();
};

module.exports = cacheMiddleware;
