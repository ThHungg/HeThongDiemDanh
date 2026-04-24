const attendanceService = require("../services/attendanceService");

const getAttendanceByClass = async (req, res) => {
  try {
    const { classCode } = req.params;
    if (!classCode) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp mã lớp học",
      });
    }
    const response = await attendanceService.getAttendanceByClass(classCode);
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

const updateAttendanceByClass = async (req, res) => {
  try {
    const { attendanceData } = req.body;
    if (!attendanceData) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp dữ liệu điểm danh",
      });
    }

    const response =
      await attendanceService.updateAttendanceByClass(attendanceData);
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

module.exports = {
  getAttendanceByClass,
  updateAttendanceByClass,
};
