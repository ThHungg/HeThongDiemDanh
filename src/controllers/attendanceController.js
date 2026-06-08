const attendanceService = require("../services/attendanceService");
const path = require("path");
const fs = require("fs");

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

const exportAttendanceByClass = async (req, res) => {
  try {
    const { classCode } = req.params;
    if (!classCode) {
      return res.status(400).json({
        status: "Err",
        code: 400,
        message: "Vui lòng cung cấp mã lớp học",
      });
    }

    const response = await attendanceService.exportAttendanceToExcel(classCode);
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

const downloadAttendanceFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      return res
        .status(400)
        .json({ status: "Err", message: "File không hợp lệ" });
    }

    if (
      fileName.includes("..") ||
      fileName.includes("/") ||
      fileName.includes("\\")
    ) {
      return res
        .status(400)
        .json({ status: "Err", message: "File không hợp lệ" });
    }

    const filePath = path.join(process.cwd(), "exports", fileName);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ status: "Err", message: "File không tồn tại" });
    }

    // Download file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.log("Download error:", err);
      } else {
        fs.unlink(filePath, (err) => {
          if (err) console.log("Delete error:", err);
          else console.log("File xóa thành công:", fileName);
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "Err",
      message: "Lỗi download file",
    });
  }
};

module.exports = {
  getAttendanceByClass,
  updateAttendanceByClass,
  exportAttendanceByClass,
  downloadAttendanceFile,
};
