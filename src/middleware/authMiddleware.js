const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const Access_Token = process.env.ACCESS_TOKEN;

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Err",
        code: 401,
        message: "Vui lòng cung cấp token",
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, Access_Token, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "Err",
          code: 401,
          message: "Token không hợp lệ",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
};

const roleMiddleware = (allowedRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (allowedRole.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({
        status: "Err",
        code: 403,
        message: "Bạn không có quyền truy cập",
      });
    }
  };
};
module.exports = { authMiddleware, roleMiddleware };
