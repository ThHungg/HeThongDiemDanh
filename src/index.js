const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const routes = require("./routes");
const redis = require("./config/redis");

require("./services/mailQueueService");
require("./services/schedulerService");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://he-thong-diem-danh.vercel.app",
      "http://localhost:3001",
      "https://hethongdiemdanh.php2json.com",
    ],
    credentials: true,
  }),
);

//middleware
app.use(cookieParser());

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init DB
connectDB();

//body parser
app.use(express.json());

//init routes
routes(app);

//handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "Err",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

app.get("/api/v1/ping", (req, res) => {
  res.status(200).json({ status: "Ok", message: "Server is alive" });
});

// Ping chính mình mỗi 5 phút để tránh Render sleep
const PING_INTERVAL = 5 * 60 * 1000; // 5 phút
setInterval(() => {
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;
  fetch(`${url}/api/v1/ping`)
    .then((res) => {
      if (res.ok) {
        console.log(`[Self-Ping] Đã gọi thành công tới ${url} để giữ server luôn bật.`);
      } else {
        console.log(`[Self-Ping] Gọi tới ${url} thất bại với mã lỗi ${res.status}`);
      }
    })
    .catch((err) => console.log(`[Self-Ping] Không thể gọi tới ${url}:`, err.message));
}, PING_INTERVAL);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
