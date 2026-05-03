const classService = require("../services/classService");

const getClassesByLecturer = async (req, res) => {
  try {
    const lecturerId = req.user.code;
    const { semester } = req.query;

    if (!lecturerId) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp mã giảng viên",
      });
    }
    const response = await classService.getClassesByLecturer(
      lecturerId,
      semester,
    );
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

const getClassByLecturerAndId = async (req, res) => {
  try {
    const lecturerId = req.user.code;
    const { classCode } = req.params;

    if (!lecturerId || !classCode) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp mã giảng viên và mã lớp học",
      });
    }

    const response = await classService.getClassByLecturerAndId(
      lecturerId,
      classCode,
    );
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

const getAllClasses = async (req, res) => {
  try {
    const { semester } = req.query;
    const response = await classService.getAllClasses(semester);
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
  getClassesByLecturer,
  getClassByLecturerAndId,
  getAllClasses,
};
