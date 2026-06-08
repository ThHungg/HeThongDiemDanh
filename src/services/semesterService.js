const Ky = require("../models/Ky");
const cacheService = require("./cacheService");

const getCurrentSemester = async () => {
  try {
    const cachedResult = await cacheService.get(
      cacheService.CACHE_KEYS.CURRENT_SEMESTER,
    );

    if (cachedResult) {
      return cachedResult;
    }

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
        "mac_dinh",
      ],
    });

    const result = {
      status: "Success",
      code: 200,
      data: currentSemester,
    };

    if (currentSemester) {
      await cacheService.set(
        cacheService.CACHE_KEYS.CURRENT_SEMESTER,
        result,
        cacheService.CACHE_TTL.LONG,
      );
    }

    return result;
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
    const cachedResult = await cacheService.get(
      cacheService.CACHE_KEYS.ALL_SEMESTERS,
    );

    if (cachedResult) {
      return cachedResult;
    }

    const semesters = await Ky.findAll({
      attributes: [
        "id",
        "ma_ky",
        "ten_ky",
        "ma_nam",
        "bat_dau_ky_hoc",
        "ket_thuc_ky_hoc",
        "mac_dinh",
      ],
      order: [["bat_dau_ky_hoc", "DESC"]],
    });

    const result = {
      status: "Success",
      code: 200,
      data: semesters,
    };

    if (semesters && semesters.length > 0) {
      await cacheService.set(
        cacheService.CACHE_KEYS.ALL_SEMESTERS,
        result,
        cacheService.CACHE_TTL.LONG,
      );
    }

    return result;
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
