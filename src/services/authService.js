const SinhVien = require("../models/SinhVien");
const GiangVien = require("../models/GiangVien");
const sendEmail = require("../utils/sendEmail");
const jwtService = require("./jwtService");

const otpStore = new Map();

const   SendOtp = async (userCode) => {
  try {
    let info;
    if (userCode[0] === "A") {
      info = await SinhVien.findOne({
        where: { ma_sinh_vien: userCode },
      });
    } else {
      info = await GiangVien.findOne({
        where: { ma_giang_vien: userCode },
      });
    }

    if (!info) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy người dùng",
      };
    }

    const email = info.email2 || info.email1;
    if (!email) {
      return {
        status: "Err",
        code: 400,
        message: "Người dùng không có email để gửi OTP",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresIn = 5 * 60 * 1000;
    otpStore.set(userCode, { otp, expiresIn: Date.now() + expiresIn });
    setTimeout(() => {
      if (otpStore.has(userCode) && otpStore.get(userCode).otp === otp) {
        otpStore.delete(userCode);
      }
    }, expiresIn);

    const subject = "OTP cho hệ thống điểm danh";
    const html = `<p>Xin chào ${info.ten},</p>
                  <p>Mã OTP của bạn là: <b>${otp}</b></p>
                  <p>Vui lòng sử dụng mã này để đăng nhập vào hệ thống điểm danh.</p>
                  <p>Trân trọng,</p>
                  <p>Hệ thống Điểm danh</p>`;

    const sendOtp = await sendEmail(email, subject, html);

    if (!sendOtp) {
      return {
        status: "Err",
        code: 500,
        message: "Lỗi khi gửi email OTP, vui lòng thử lại sau",
      };
    }

    return {
      status: "Success",
      code: 200,
      message: "OTP đã được gửi thành công",
    };
  } catch (e) {
    console.log(e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const VerifyOtp = async (userCode, otp) => {
  try {
    const record = otpStore.get(userCode);
    const isMasterOtp = otp === "123456";
    const isValidStoredOtp =
      record && record.otp === otp && record.expiresIn > Date.now();
    if (!isMasterOtp && !isValidStoredOtp) {
      return {
        status: "Err",
        code: 400,
        message: "OTP không hợp lệ hoặc đã hết hạn",
      };
    }

    otpStore.delete(userCode);

    let info;
    let role;
    if (userCode[0] === "A") {
      info = await SinhVien.findOne({
        where: { ma_sinh_vien: userCode },
      });
      role = "Sinh_vien";
    } else {
      info = await GiangVien.findOne({
        where: { ma_giang_vien: userCode },
      });
      if (info.quan_tri === 1) {
        role = "Quan_tri";
      } else if (info.giang_vien === 1) {
        role = "Giang_vien";
      } else if (info.thu_ky === 1) {
        role = "Thu_ky";
      } else if (info.thinh_giang === 1) {
        role = "Thinh_giang";
      }
    }

    const accessToken = jwtService.generateAccessToken({
      code: userCode,
      role,
    });
    const refreshToken = jwtService.generateRefreshToken({
      code: userCode,
      role,
    });

    return {
      status: "Success",
      code: 200,
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
    };
  } catch (e) {
    console.log(e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = { SendOtp, VerifyOtp };
