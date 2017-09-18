import config from '../../config/config';
const redis = require('redis');
const client = redis.createClient({ url: config.redis.host });

module.exports = {
  tryCache(req, res, next) {
    client.get(req._cacheKey, (err, data) => {
      if (err) {
        console.log('redis err');
        next(err);
      } else {
        if (data != null) {
          console.log('sending cached data');
          res.json(JSON.parse(data));
        } else {
          next();
        }
      }
    });
  },
  redisClient: client,
  clearCache() {
    return new Promise((resolve, reject) => {
      client.flushdb((err, success) => {
        if (err) { reject(err); } else {
          console.log('cache cleared');
          resolve();
        }
      })
    });
  }
}
