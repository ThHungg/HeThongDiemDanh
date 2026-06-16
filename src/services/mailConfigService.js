const { ReportMailConfig, GiangVien } = require("../models");
const { getVietnamTime } = require("../utils/getVietnamTime");
const { formatDate } = require("../utils/formatDate");
const { getWeekRange } = require("../utils/getWeekRange");
const { getMonthRange } = require("../utils/getMonthRange");
const studentService = require("./studentService");
const { emailQueue } = require("./mailQueueService");

// 1. Lấy tất cả cấu hình
const getMailConfigs = async () => {
  try {
    const configs = await ReportMailConfig.findAll();
    return {
      status: "Success",
      code: 200,
      data: configs,
    };
  } catch (e) {
    console.error("[getMailConfigs Service Error]:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

// 2. Tạo mới một cấu hình
const createMailConfig = async (data) => {
  try {
    const { kich_hoat, loai_chu_ky, gio_gui, diem_min, diem_max, email_nhan } =
      data;

    if (gio_gui !== undefined && (gio_gui < 20 || gio_gui > 23)) {
      return {
        status: "Err",
        code: 400,
        message: "Khung giờ gửi chỉ được chọn trong khoảng từ 20h đến 23h",
      };
    }

    const config = await ReportMailConfig.create({
      kich_hoat: kich_hoat ?? 0,
      loai_chu_ky: loai_chu_ky ?? "weekly",
      gio_gui: gio_gui ?? 20,
      diem_min: diem_min ?? 0.0,
      diem_max: diem_max ?? 5.0,
      email_nhan: email_nhan ?? null,
    });

    return {
      status: "Success",
      code: 201,
      message: "Tạo cấu hình gửi mail thành công",
      data: config,
    };
  } catch (e) {
    console.error("[createMailConfig Service Error]:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

// 3. Cập nhật một cấu hình theo ID
const updateMailConfig = async (id, data) => {
  try {
    const { kich_hoat, loai_chu_ky, gio_gui, diem_min, diem_max, email_nhan } =
      data;

    if (gio_gui !== undefined && (gio_gui < 20 || gio_gui > 23)) {
      return {
        status: "Err",
        code: 400,
        message: "Khung giờ gửi chỉ được chọn trong khoảng từ 20h đến 23h",
      };
    }

    const config = await ReportMailConfig.findByPk(id);
    if (!config) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy cấu hình",
      };
    }

    config.kich_hoat = kich_hoat ?? config.kich_hoat;
    config.loai_chu_ky = loai_chu_ky ?? config.loai_chu_ky;
    config.gio_gui = gio_gui ?? config.gio_gui;
    config.diem_min = diem_min ?? config.diem_min;
    config.diem_max = diem_max ?? config.diem_max;
    config.email_nhan =
      email_nhan !== undefined ? email_nhan : config.email_nhan;
    await config.save();

    return {
      status: "Success",
      code: 200,
      message: "Cập nhật cấu hình gửi mail thành công",
      data: config,
    };
  } catch (e) {
    console.error("[updateMailConfig Service Error]:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

// 4. Xóa cấu hình theo ID
const deleteMailConfig = async (id) => {
  try {
    const config = await ReportMailConfig.findByPk(id);
    if (!config) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy cấu hình để xóa",
      };
    }
    await config.destroy();
    return {
      status: "Success",
      code: 200,
      message: "Xóa cấu hình gửi mail thành công",
    };
  } catch (e) {
    console.error("[deleteMailConfig Service Error]:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

// 5. Gửi email báo cáo ngay lập tức (Manual Send cho testing)
const sendMailNow = async (id) => {
  try {
    const config = await ReportMailConfig.findByPk(id);
    if (!config) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy cấu hình",
      };
    }

    // const vnTime = getVietnamTime();
    const vnTime = new Date("2026-06-13");

    let range = { startDate: "", endDate: "" };

    if (config.loai_chu_ky === "daily") {
      range = {
        startDate: formatDate(vnTime),
        endDate: formatDate(vnTime),
      };
    } else if (config.loai_chu_ky === "weekly") {
      range = getWeekRange(vnTime);
    } else if (config.loai_chu_ky === "monthly") {
      range = getMonthRange(vnTime);
    }

    console.log(
      `[Manual Send] Processing config ID ${config.id} (${config.loai_chu_ky})...`,
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
      return {
        status: "Err",
        code: 400,
        message: `Không thể lấy danh sách sinh viên: ${studentRes.message}`,
      };
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
      recipientEmails = thuKy.map((t) => t.email1 || t.email2).filter(Boolean);
    }

    if (recipientEmails.length === 0) {
      return {
        status: "Err",
        code: 400,
        message: "Không tìm thấy email người nhận.",
      };
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
          <h2 style="color: #8B0000; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Báo cáo danh sách sinh viên có điểm thấp (Gửi ngay)</h2>
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
      await emailQueue.add("sendEmail", {
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`[Manual Send] Queued email to ${toEmail}`);
    }

    return {
      status: "Success",
      code: 200,
      message: "Gửi báo cáo email thành công!",
    };
  } catch (e) {
    console.error("[sendMailNow Service Error]:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = {
  getMailConfigs,
  createMailConfig,
  updateMailConfig,
  deleteMailConfig,
  sendMailNow,
};
