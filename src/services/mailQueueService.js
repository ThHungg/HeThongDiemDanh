const { Queue, Worker } = require("bullmq");
const redis = require("../config/redis");
const sendEmail = require("../utils/sendEmail");

const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;
    console.log("Đang gửi email tới ", to);
    await sendEmail(to, subject, html);
  },
  {
    connection: redis,
    concurrency: 1,
  },
);

emailWorker.on("failed", (job, err) => {
  console.log("Lỗi gửi mail", job.id, err.message);
});

module.exports = {
  emailQueue,
};
