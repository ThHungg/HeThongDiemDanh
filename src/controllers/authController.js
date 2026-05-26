const authService = require("../services/authService");
const jwtService = require("../services/jwtService");

const SendOtp = async (req, res) => {
  try {
    const { userCode } = req.body;
    if (!userCode) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng nhập thông tin đăng nhập",
      });
    }

    const response = await authService.SendOtp(userCode.toUpperCase());
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const VerifyOtp = async (req, res) => {
  try {
    const { userCode, otp } = req.body;
    if (!userCode || !otp) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng nhập mã sinh viên và OTP",
      });
    }
    if (otp.length !== 6) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "OTP phải có 6 chữ số",
      });
    }
    const response = await authService.VerifyOtp(userCode.toUpperCase(), otp);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    const { refreshToken, ...newResponse } = response;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(newResponse);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const Logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      res.clearCookie("refreshToken");
    }
    return res.status(200).json({
      status: "Success",
      code: 200,
      message: "Đăng xuất thành công",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const GetCurrentUser = async (req, res) => {
  try {
    const id = req.user.code;
    const role = req.user.role;
    const response = await authService.GetCurrentUser(id, role);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

const RefreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        status: "Err",
        message: "Không tìm thấy Refresh Token trong Cookie",
      });
    }

    const response = await jwtService.refreshToken(token);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: "Err", message: "Lỗi hệ thống" });
  }
};

module.exports = { SendOtp, VerifyOtp, Logout, GetCurrentUser, RefreshToken };
