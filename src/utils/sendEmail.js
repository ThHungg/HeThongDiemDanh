const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `"Hệ thống Điểm danh" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi khi gửi email",
    };
  }
};

const sendEmailToStudent = async (
  emailStudent,
  subject,
  content,
  classCode,
) => {
  try {
    if (!emailStudent || !subject || !content || !classCode) {
      return {
        status: "Err",
        code: 400,
        message: "Thiếu thông tin cần thiết để gửi email",
      };
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Hệ thống Điểm danh" <${process.env.EMAIL_USER}>`,
      to: emailStudent,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 500px;">
          <h2 style="color: #8B0000;  padding-bottom: 10px;">
            ${subject}
          </h2>

          <p>Xin chào em,</p>

          <div >
            ${content}
          </div>

          <p style="font-size: 13px; color: #666;">
            <strong>Lớp học phần:</strong> ${classCode}
          </p>

          <hr style="border: none; border-top: 1px solid #eee; " />

          <p style="margin: 0;">Trân trọng,</p>
          <p style="margin: 0; font-weight: bold;">Khoa Công nghệ Thông tin - Trường Đại học Thăng Long</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi khi gửi email",
    };
  }
};

module.exports = { sendEmail, sendEmailToStudent };
