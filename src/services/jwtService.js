const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const Access_Token = process.env.ACCESS_TOKEN;
const Refresh_Token = process.env.REFRESH_TOKEN;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, Access_Token, { expiresIn: "1d" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, Refresh_Token, { expiresIn: "7d" });
};

const refreshToken = async (token) => {
  try {
    if (!token) {
      return {
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp token",
      };
    }

    const decoded = jwt.verify(token, Refresh_Token);
    const accessToken = generateAccessToken({
      code: decoded.code,
      role: decoded.role,
    });

    return {
      status: "Ok",
      message: "Làm mới token thành công",
      accessToken,
    };
  } catch (e) {
    console.log(e);
    return {
      status: "Err",
      code: 401,
      message: "Token không hợp lệ hoặc đã hết hạn",
    };
  }
};

module.exports = { generateAccessToken, generateRefreshToken, refreshToken };
