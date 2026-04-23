const semesterService = require("../services/semesterService");

const getCurrentSemester = async (req, res) => {
  try {
    const response = await semesterService.getCurrentSemester();
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

const getAllSemesters = async (req, res) => {
  try {
    const response = await semesterService.getAllSemesters();
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
  getCurrentSemester,
  getAllSemesters,
};
