const {
  mapClasses,
  mapClassInfo,
  mapSessions,
} = require("../mappers/classMapper");
const {
  Tkb,
  HocPhan,
  TkbChiTiet,
  DangKy,
  SinhVien,
  Ky,
  BuoiHoc,
} = require("../models");
const { getAttendanceDates } = require("../utils/dateHelper");

const semesterService = require("./semesterService");
const getClassesByLecturer = async (lecturerId, semester) => {
  try {
    let currentSemester;
    if (semester) {
      currentSemester = semester;
    } else {
      currentSemester = await semesterService.getCurrentSemester();
    }

    console.log(currentSemester);
    const classes = await Tkb.findAll({
      where: {
        ma_ky: currentSemester,
        ma_giang_vien: lecturerId,
      },
      attributes: [
        "id",
        "ma_lop_hoc_phan",
        "ma_hoc_phan",
        "ten_lop",
        "sldk",
        "suc_chua",
      ],
      include: [
        {
          model: HocPhan,
          as: "hoc_phan",
          attributes: ["ten_hoc_phan", "ma_hoc_phan"],
        },
        {
          model: TkbChiTiet,
          as: "thoi_khoa_bieu_chi_tiet",
          attributes: ["bat_dau", "ket_thuc", "thu"],
        },
      ],
      order: [["id", "DESC"]],
    });

    const transformedClasses = mapClasses(classes);

    return {
      status: "Ok",
      code: 200,
      data: transformedClasses,
    };
  } catch (e) {
    console.log("e :", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getClassByLecturerAndId = async (lecturerId, classCode) => {
  try {
    const currentSemester = await semesterService.getCurrentSemester();
    const classInfo = await Tkb.findOne({
      where: {
        ma_lop_hoc_phan: classCode,
      },
      attributes: [
        "id",
        "ma_lop_hoc_phan",
        "ma_hoc_phan",
        "ten_lop",
        "sldk",
        "suc_chua",
      ],
      include: [
        {
          model: DangKy,
          as: "danh_sach_dang_ky",
          attributes: ["id", "sinh_vien_id"],
          include: [
            {
              model: SinhVien,
              as: "sinh_vien",
              attributes: ["ma_sinh_vien", "ten", "lop_chuyen_nganh"],
            },
          ],
        },
        {
          model: HocPhan,
          as: "hoc_phan",
          attributes: ["ten_hoc_phan", "ma_hoc_phan"],
        },
        {
          model: TkbChiTiet,
          as: "thoi_khoa_bieu_chi_tiet",
          attributes: ["id", "bat_dau", "ket_thuc", "thu"],
        },
        {
          model: Ky,
          as: "ky",
          attributes: [
            "id",
            "ma_ky",
            "ten_ky",
            "ma_nam",
            "bat_dau_ky_hoc",
            "ket_thuc_ky_hoc",
          ],
        },
      ],
    });
    if (!classInfo) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy lớp học phần",
      };
    }

    const classInfoTransformed = mapClassInfo(classInfo);

    let sessions = await BuoiHoc.findAll({
      where: { tkb_id: classInfoTransformed.id },
      order: [["ngay_hoc", "ASC"]],
      include: [
        {
          model: TkbChiTiet,
          as: "chi_tiet_tiet_hoc",
          attributes: ["id", "bat_dau", "ket_thuc", "thu"],
        },
      ],
    });

    if (sessions.length === 0) {
      const semesterStartDate = classInfoTransformed.ky?.batDauKyHoc;
      const semesterEndDate = classInfoTransformed.ky?.ketThucKyHoc;
      const schedules = classInfoTransformed.thoiKhoaBieuChiTiet;

      const datesToInsert = getAttendanceDates(
        classInfoTransformed.id,
        semesterStartDate,
        semesterEndDate,
        schedules,
      );

      if (datesToInsert.length > 0) {
        await BuoiHoc.bulkCreate(datesToInsert, { ignoreDuplicates: true });

        sessions = await BuoiHoc.findAll({
          where: { tkb_id: classInfoTransformed.id },
          order: [["ngay_hoc", "ASC"]],
          include: [
            {
              model: TkbChiTiet,
              as: "chi_tiet_tiet_hoc",
              attributes: ["id", "bat_dau", "ket_thuc", "thu"],
            },
          ],
        });
      }
    }

    return {
      status: "Ok",
      code: 200,
      data: {
        ...classInfoTransformed,
        // buoi_hoc: mapSessions(sessions),
        buoi_hoc: mapSessions(sessions),
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = {
  getClassesByLecturer,
  getClassByLecturerAndId,
};
