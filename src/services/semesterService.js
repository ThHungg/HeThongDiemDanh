const Ky = require("../models/Ky");

const getCurrentSemester = async () => {
  try {
    const currentSemester = await Ky.findOne({
      where: {
        mac_dinh: true,
      },
      attributes: [
        "id",
        "ma_ky",
        "ten_ky",
        "ma_nam",
        "bat_dau_ky_hoc",
        "ket_thuc_ky_hoc",
      ],
    });

    return {
      status: "Success",
      code: 200,
      data: currentSemester,
    };
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getAllSemesters = async () => {
  try {
    const semesters = await Ky.findAll({
      attributes: [
        "id",
        "ma_ky",
        "ten_ky",
        "ma_nam",
        "bat_dau_ky_hoc",
        "ket_thuc_ky_hoc",
      ],
      order: [["bat_dau_ky_hoc", "DESC"]],
    });

    return {
      status: "Success",
      code: 200,
      data: semesters,
    };
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = {
  getCurrentSemester,
  getAllSemesters,
};
