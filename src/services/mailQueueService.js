const { Queue, Worker } = require("bullmq");
const redis = require("../config/redis");
const { sendEmail } = require("../utils/sendEmail");

const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;
    await sendEmail(to, subject, html);
    console.log(`Email sent to ${to} with subject "${subject}"`);
  },
  {
    connection: redis,
    concurrency: 1,
    limiter: {
      max: 1,
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
