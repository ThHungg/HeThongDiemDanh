const studentService = require("../services/studentService");

const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp mã sinh viên",
      });
    }
    const response = await studentService.getStudentById(studentId);
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};

module.exports = {
  getStudentById,
};
