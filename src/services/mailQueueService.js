const { Queue, Worker } = require("bullmq");
const redis = require("../config/redis");
const { sendEmail } = require("../utils/sendEmail");

const emailQueue = new Queue("emailQueue", {
  connection: redis.connectionOpts,
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html, createdAt } = job.data;
    
    const startTime = Date.now();
    const waitTime = createdAt ? startTime - createdAt : null;
    const startTimeStr = new Date(startTime).toLocaleTimeString("vi-VN");
    
    console.log(
      `[Queue STT: ${job.id}] -> BẮT ĐẦU xử lý gửi mail cho ${to} | Lúc: ${startTimeStr}` + 
      (waitTime !== null ? ` | Thời gian chờ trong Queue: ${waitTime}ms` : "")
    );

    await sendEmail(to, subject, html);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    const endTimeStr = new Date(endTime).toLocaleTimeString("vi-VN");
    
    console.log(
      `[Queue STT: ${job.id}] -> GỬI THÀNH CÔNG cho ${to} | Lúc: ${endTimeStr} | Thời gian gọi SMTP: ${duration}ms`
    );
  },
  {
    connection: redis.connectionOpts,
    concurrency: 5,
    limiter: {
      max: 5,
      duration: 1000,
    },
  },
);
emailWorker.on("failed", (job, err) => {
  console.log("Lỗi gửi mail", job.id, err.message);
});

module.exports = {
  emailQueue,
};
