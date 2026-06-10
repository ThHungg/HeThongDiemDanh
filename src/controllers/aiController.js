const aiService = require("../services/ai.service");
const StudentService = require("../services/studentService");

const AIController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui long nhap yeu cau tim kiem.",
      });
    }

    const filterParams = await aiService.AIService(message);
    console.log("filterParams", filterParams);
    if (!filterParams) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message:
          "Toi chua hieu y Thay/Co. Xin hay noi ro hon ve dieu kien tim kiem.",
      });
    }

    const studentsResponse = await StudentService.getAllStudents(
      null,
      1,
      50,
      filterParams.search,
      filterParams.startDate,
      filterParams.endDate,
      filterParams.minScore,
      filterParams.maxScore,
      filterParams.maLop,
    );

    if (studentsResponse.status === "Err") {
      return res.status(studentsResponse.code || 400).json(studentsResponse);
    }

    return res.status(200).json({
      status: "Ok",
      code: 200,
      filtersApplied: filterParams,
      data: studentsResponse.data,
      pagination: studentsResponse.pagination,
    });
  } catch (error) {
    console.error("AI Controller error:", error);
    return res
      .status(500)
      .json({ status: "Err", code: 500, message: "Loi he thong AI." });
  }
};

module.exports = { AIController };
