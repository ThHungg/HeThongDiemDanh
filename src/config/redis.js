const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

let redis;

// Nếu có biến REDIS_URL (khi chạy trên Render), dùng trực tiếp URL đó
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  });
} else {
  // Khi không có REDIS_URL (chạy local dưới máy tính)
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  });
}

redis.on("connect", () => {
  console.log("Kết nối Redis thành công!");
});

redis.on("error", (err) => {
  console.error("Kết nối Redis thất bại:", err);
});

module.exports = redis;
