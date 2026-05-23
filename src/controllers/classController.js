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
    const {
      semester,
      page = 1,
      limit = 10,
      lecturerId,
      searchText,
    } = req.query;
    const response = await classService.getAllClasses({
      semester,
      page: parseInt(page),
      limit: parseInt(limit),
      lecturerId,
      searchText,
    });
    if (response.status === "Err") {
      return res.status(response.code || 400).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    console.error("getAllClasses controller error:", e);
    return res.status(500).json({
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    });
  }
};



const getCurrentClasses = async (req, res) => {
  try {
    const lecturerId = req.user.code;
    if (!lecturerId) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp mã giảng viên",
      });
    }
    const response = await classService.getCurrentClasses(lecturerId);
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

const getAllLecturer = async (req, res) => {
  try {
    const response = await classService.getAllLecturer();
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
  getCurrentClasses,
  getAllLecturer,
};
