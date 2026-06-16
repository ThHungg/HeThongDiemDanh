const { Queue, Worker } = require("bullmq");
const redis = require("../config/redis");
const { ReportMailConfig, GiangVien } = require("../models");
const { getVietnamTime } = require("../utils/getVietnamTime");
const { formatDate } = require("../utils/formatDate");
const { getWeekRange } = require("../utils/getWeekRange");
const { getMonthRange } = require("../utils/getMonthRange");
const { isLastDayOfMonth } = require("../utils/isLastDayOfMonth");
const studentService = require("./studentService");
const { emailQueue } = require("./mailQueueService");

const runSchedulerTask = async () => {
  try {
    const vnTime = getVietnamTime();
    const currentHour = vnTime.getHours();
    const currentDayOfWeek = vnTime.getDay(); // 0 = Chủ nhật, 1-6 = Thứ 2 đến Thứ 7

    console.log(
      `[Scheduler] Checking mail configs at local time: ${vnTime.toLocaleString("vi-VN")}`,
    );

    const configs = await ReportMailConfig.findAll({
      where: { kich_hoat: 1 },
    });

    for (const config of configs) {
      let shouldSend = false;
      let range = { startDate: "", endDate: "" };

      if (config.loai_chu_ky === "daily") {
        if (currentHour === config.gio_gui) {
          shouldSend = true;
          range = {
            startDate: formatDate(vnTime),
            endDate: formatDate(vnTime),
          };
        }
      } else if (config.loai_chu_ky === "weekly") {
        if (currentDayOfWeek === 0 && currentHour === config.gio_gui) {
          shouldSend = true;
          range = getWeekRange(vnTime);
        }
      } else if (config.loai_chu_ky === "monthly") {
        if (isLastDayOfMonth(vnTime) && currentHour === config.gio_gui) {
          shouldSend = true;
          range = getMonthRange(vnTime);
        }
      }

      if (shouldSend) {
        console.log(
          `[Scheduler] Processing config ID ${config.id} (${config.loai_chu_ky})...`,
        );
        const studentRes = await studentService.getAllStudents(
          null,
          1,
          999999,
          "",
          range.startDate,
          range.endDate,
          config.diem_min,
          config.diem_max,
        );
        if (studentRes.status !== "Ok") {
          console.error(
            `[Scheduler] Không thể lấy danh sách sinh viên cho cấu hình ID ${config.id}:`,
            studentRes.message,
          );
          continue;
        }

        const students = studentRes.data || [];

        let recipientEmails = [];

        if (config.email_nhan && config.email_nhan.trim()) {
          recipientEmails = config.email_nhan
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);
        } else {
          const thuKy = await GiangVien.findAll({
            where: {
              thu_ky: 1,
              trang_thai: 1,
            },
          });
          recipientEmails = thuKy
            .map((t) => t.email1 || t.email2)
            .filter(Boolean);
        }

        if (recipientEmails.length === 0) {
          console.warn(`[Scheduler] Config ID ${config.id} has no recipients.`);
          continue;
        }

        let subject = "";
        if (config.loai_chu_ky === "daily") {
          subject = `[Hệ thống Điểm danh] Báo cáo Ngày ${range.startDate} - SV điểm thấp (${config.diem_min} - ${config.diem_max})`;
        } else if (config.loai_chu_ky === "weekly") {
          subject = `[Hệ thống Điểm danh] Báo cáo Tuần (${range.startDate} đến ${range.endDate}) - SV điểm thấp (${config.diem_min} - ${config.diem_max})`;
        } else {
          subject = `[Hệ thống Điểm danh] Báo cáo Tháng (${vnTime.getMonth() + 1}/${vnTime.getFullYear()}) - SV điểm thấp (${config.diem_min} - ${config.diem_max})`;
        }

        const htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fcfcfc;">
            <div style="text-align: center; border-bottom: 2px solid #8B0000; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #8B0000; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Báo cáo danh sách sinh viên có điểm thấp</h2>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Hệ thống quản lý điểm danh và chuyên cần</p>
            </div>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #8B0000; padding: 12px 15px; margin-bottom: 20px; border-radius: 0 4px 4px 0;">
              <p style="margin: 4px 0;"><strong>Chu kỳ báo cáo:</strong> ${config.loai_chu_ky === "daily" ? "Hàng ngày" : config.loai_chu_ky === "weekly" ? "Hàng tuần" : "Hàng tháng"}</p>
              <p style="margin: 4px 0;"><strong>Thời gian lọc dữ liệu:</strong> Từ ngày ${range.startDate} đến ngày ${range.endDate}</p>
              <p style="margin: 4px 0;"><strong>Khoảng điểm trung bình lọc:</strong> ${config.diem_min} - ${config.diem_max}</p>
            </div>
            ${
              students.length === 0
                ? `
              <div style="text-align: center; padding: 30px; background-color: #eef7ee; color: #2e7d32; border-radius: 6px; font-weight: bold; border: 1px solid #c8e6c9;">
                Không có sinh viên nào có điểm trung bình chuyên cần nằm trong khoảng này trong chu kỳ báo cáo.
              </div>
            `
                : `
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; text-align: left;">
                  <thead>
                    <tr style="background-color: #8B0000; color: #ffffff;">
                      <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">STT</th>
                      <th style="padding: 10px; border: 1px solid #ddd;">Mã SV</th>
                      <th style="padding: 10px; border: 1px solid #ddd;">Họ và tên</th>
                      <th style="padding: 10px; border: 1px solid #ddd;">Lớp chuyên ngành</th>
                      <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Điểm TB chuyên cần</th>
                      <th style="padding: 10px; border: 1px solid #ddd;">Chi tiết lớp HP học</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${students
                      .map((student, idx) => {
                        const classDetails =
                          student.dangKy && student.dangKy.length > 0
                            ? student.dangKy
                                .map(
                                  (dk) =>
                                    `${dk.tenHocPhan || dk.maLopHocPhan}: <strong>${dk.diemChuyenCan !== null ? dk.diemChuyenCan : "-"}</strong>`,
                                )
                                .join("<br/>")
                            : "Không đăng ký";
                        return `
                        <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f9f9f9"};">
                          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
                          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #333;">${student.maSinhVien}</td>
                          <td style="padding: 10px; border: 1px solid #ddd;">${student.ten}</td>
                          <td style="padding: 10px; border: 1px solid #ddd;">${student.lopChuyenNganh || ""}</td>
                          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #d32f2f; text-align: center;">
                            ${student.diemTrungBinhChuyenCan !== null ? student.diemTrungBinhChuyenCan : "-"}
                          </td>
                          <td style="padding: 10px; border: 1px solid #ddd; font-size: 13px;">${classDetails}</td>
                        </tr>
                      `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
            }
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 12px; color: #888; text-align: center;">
              <p style="margin: 0;">Email này được gửi tự động từ hệ thống điểm danh. Vui lòng không trả lời trực tiếp email này.</p>
              <p style="margin: 5px 0 0 0;">Khoa Công nghệ Thông tin - Trường Đại học Thăng Long</p>
            </div>
          </div>
        `;

        for (const toEmail of recipientEmails) {
          try {
            await emailQueue.add("sendEmail", {
              to: toEmail,
              subject,
              html: htmlContent,
            });
            console.log(`[Scheduler] Queued email to ${toEmail}`);
          } catch (e) {
            console.error(`[Scheduler] Failed to queue email to ${toEmail}:`, e);
          }
        }
      }
    }
  } catch (e) {
    console.error("[Scheduler] Error in runSchedulerTask:", e);
  }
};

const schedulerQueue = new Queue("schedulerQueue", {
  connection: redis.connectionOpts,
});

const initScheduler = async () => {
  try {
    // Clear existing repeatable jobs to avoid duplicates
    const repeatableJobs = await schedulerQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await schedulerQueue.removeRepeatableByKey(job.key);
    }

    // Add new repeatable job to run every hour on the hour
    await schedulerQueue.add(
      "checkMailConfigs",
      {},
      {
        repeat: {
          pattern: "0 * * * *",
        },
      }
    );
    console.log("[Scheduler] BullMQ Repeatable Job initialized successfully.");
  } catch (error) {
    console.error("[Scheduler] Failed to initialize repeatable job:", error);
  }
};

initScheduler();

const schedulerWorker = new Worker(
  "schedulerQueue",
  async (job) => {
    if (job.name === "checkMailConfigs") {
      console.log(`[Scheduler Worker] Executing repeatable task...`);
      await runSchedulerTask();
    }
  },
  {
    connection: redis.connectionOpts,
  }
);
