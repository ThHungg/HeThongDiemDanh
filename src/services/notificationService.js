const { SinhVien } = require("../models");
const { emailQueue } = require("./mailQueueService");
const { Op } = require("sequelize");

const sendEmail = async (listMsv, subject, content, classCode) => {
  try {
    if (!listMsv || !subject || !content) {
      return {
        status: "Err",
        code: 400,
        message: "Vui lòng nhập đầy đủ thông tin để gửi email",
      };
    }

    const msvArray = Array.isArray(listMsv) ? listMsv : [listMsv];

    if (msvArray.length === 0) {
      return {
        status: "Err",
        code: 400,
        message: "Danh sách mã sinh viên không được để trống",
      };
    }

    const students = await SinhVien.findAll({
      where: {
        ma_sinh_vien: {
          [Op.in]: msvArray,
        },
      },
      attributes: ["email1", "email2", "ma_sinh_vien"],
      raw: true,
    });

    if (!students || students.length === 0) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy thông tin sinh viên nào phù hợp",
      };
    }

    const jobs = [];

    for (const student of students) {
      const targetEmail =
        student.email2 && student.email2.trim() !== ""
          ? student.email2
          : student.email1;

      if (!targetEmail || targetEmail.trim() === "") continue;

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 500px;">
          <h2 style="color: #8B0000; padding-bottom: 10px; border-bottom: 2px solid #8B0000;">
            ${subject}
          </h2>
          <p>Xin chào em,</p>

          <div >
            ${content}
          </div>


          <p style="font-size: 13px; color: #666; margin-top: 15px;">
            <strong>Lớp học phần:</strong> ${classCode}
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

          <p style="margin: 0; color: #555;">Trân trọng,</p>
          <p style="margin: 0; font-weight: bold; color: #8B0000;">Khoa Công nghệ Thông tin - Trường Đại học Thăng Long</p>
        </div>`;

      jobs.push({
        name: "sendEmail",
        data: {
          to: targetEmail,
          subject: subject,
          html: html,
        },
        opts: {
          attempts: 3,
          backoff: 5000,
        },
      });
    }

    if (jobs.length === 0) {
      return {
        status: "Err",
        code: 400,
        message: "Không tìm thấy địa chỉ thư điện tử hợp lệ nào để gửi đi",
      };
    }

    await emailQueue.addBulk(jobs);

    return {
      status: "Ok",
      code: 200,
      message: `Hệ thống đã tiếp nhận gửi thông báo thành công tới ${jobs.length} sinh viên`,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = {
  sendEmail,
};
