const { SinhVien } = require("../models/index");

const getStudentById = async (studentId) => {
  try {
    const student = await SinhVien.findOne({
      where: {
        ma_sinh_vien: studentId,
      },
    //   attributes: ["ma_sinh_vien", "ten", "lop_chuyen_nganh"],
    });

    if (!student) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy sinh viên",
      };
    }

    return {
      status: "Ok",
      code: 200,
      message: "Lấy thông tin sinh viên thành công",
      data: student,
    };
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
