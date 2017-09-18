const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.port || 3002,
  mongooseDebug: process.env.NODE_ENV != 'production',
  mongo: {
    host: process.env.MONGO_URL || 'mongodb://localhost/virani-jodel-dev',
    port: process.env.MONGO_HOST || 27017
  },
  redis: {
    host: process.env.REDIS_URL || 'redis://localhost:6379'
  }
};

export default config;
