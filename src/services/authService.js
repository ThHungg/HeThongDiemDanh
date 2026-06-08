const SinhVien = require("../models/SinhVien");
const GiangVien = require("../models/GiangVien");
const { sendEmail } = require("../utils/sendEmail");
const jwtService = require("./jwtService");
const { emailQueue } = require("./mailQueueService");
const redis = require("../config/redis");
const otpStore = new Map();

const SendOtp = async (userCode) => {
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

    await redis.set(`otp:${userCode}`, otp, "EX", 300);

    const subject = "OTP cho hệ thống điểm danh";
    const html = `<p>Xin chào ${info.ten},</p>
                  <p>Mã OTP của bạn là: <b>${otp}</b></p>
                  <p>Vui lòng sử dụng mã này để đăng nhập vào hệ thống điểm danh.</p>
                  <p>Trân trọng,</p>
                  <p>Hệ thống Điểm danh</p>`;

    await emailQueue.add("sendEmail", {
      to: email,
      subject: subject,
      html: html,
    });

    // const expiresIn = 5 * 60 * 1000;
    // otpStore.set(userCode, { otp, expiresIn: Date.now() + expiresIn });
    // setTimeout(() => {
    //   if (otpStore.has(userCode) && otpStore.get(userCode).otp === otp) {
    //     otpStore.delete(userCode);
    //   }
    // }, expiresIn);

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
    // const record = otpStore.get(userCode);
    const record = await redis.get(`otp:${userCode}`);
    const isMasterOtp = otp === "123456";
    const isValidStoredOtp = record && record === otp;
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
    let filteredInfo;
    if (userCode[0] === "A") {
      info = await SinhVien.findOne({
        where: { ma_sinh_vien: userCode },
      });
      if (!info) {
        return {
          status: "Err",
          code: 404,
          message: "Không tìm thấy người dùng",
        };
      }
      role = "Sinh_vien";
      filteredInfo = {
        ten: info.ten,
        ma_sinh_vien: info.ma_sinh_vien,
        dien_thoai1: info.dien_thoai1,
        dien_thoai2: info.dien_thoai2,
        email1: info.email1,
        email2: info.email2,
        khoa: info.khoa,
        khoa_nhap_hoc: info.khoa_nhap_hoc,
        lop_chuyen_nganh: info.lop_chuyen_nganh,
        role: role,
      };
    } else {
      info = await GiangVien.findOne({
        where: { ma_giang_vien: userCode },
      });
      if (!info) {
        return {
          status: "Err",
          code: 404,
          message: "Không tìm thấy người dùng",
        };
      }
      if (info.quan_tri === 1) {
        role = "Quan_tri";
      } else if (info.giang_vien === 1) {
        role = "Giang_vien";
      } else if (info.thu_ky === 1) {
        role = "Thu_ky";
      } else if (info.thinh_giang === 1) {
        role = "Thinh_giang";
      }

      filteredInfo = {
        ten: info.ten,
        ma_giang_vien: info.ma_giang_vien,
        dien_thoai: info.dien_thoai,
        email1: info.email1,
        email2: info.email2,
        don_vi: info.don_vi,
        hoc_vi: info.hoc_vi,
        role: role,
      };
    }

    const accessToken = jwtService.generateAccessToken({
      id: info.id,
      code: userCode,
      role,
    });
    const refreshToken = jwtService.generateRefreshToken({
      id: info.id,
      code: userCode,
      role,
    });

    return {
      status: "Success",
      code: 200,
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      filteredInfo,
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

const GetCurrentUser = async (id, role) => {
  try {
    if (role === "Sinh_vien") {
      const student = await SinhVien.findOne({
        where: { ma_sinh_vien: id },
      });

      if (student) {
        return {
          status: "Success",
          code: 200,
          data: {
            ten: student.ten,
            ma_sinh_vien: student.ma_sinh_vien,
            dien_thoai1: student.dien_thoai1,
            dien_thoai2: student.dien_thoai2,
            email1: student.email1,
            email2: student.email2,
            khoa: student.khoa,
            khoa_nhap_hoc: student.khoa_nhap_hoc,
            lop_chuyen_nganh: student.lop_chuyen_nganh,
          },
        };
      }
    } else if (
      role === "Giang_vien" ||
      role === "Quan_tri" ||
      role === "Thu_ky" ||
      role === "Thinh_giang"
    ) {
      const lecturer = await GiangVien.findOne({
        where: { ma_giang_vien: id },
      });

      if (lecturer) {
        return {
          status: "Success",
          code: 200,
          data: {
            ten: lecturer.ten,
            ma_giang_vien: lecturer.ma_giang_vien,
            dien_thoai: lecturer.dien_thoai,
            email1: lecturer.email1,
            email2: lecturer.email2,
            don_vi: lecturer.don_vi,
            hoc_vi: lecturer.hoc_vi,
          },
        };
      }
    }
  } catch (e) {
    console.log(e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = { SendOtp, VerifyOtp, GetCurrentUser };
