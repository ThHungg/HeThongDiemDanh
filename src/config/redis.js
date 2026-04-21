const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: {},
  maxRetriesPerRequest: null,

  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => {
  console.log("Kết nối redis thành công");
});

redis.on("error", (err) => {
  console.log("Kết nối thất bại");
});

module.exports = redis;
