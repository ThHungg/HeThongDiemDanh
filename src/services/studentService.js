const semesterService = require("./semesterService");
const {
  Tkb,
  HocPhan,
  TkbChiTiet,
  DangKy,
  SinhVien,
  Ky,
  BuoiHoc,
  GiangVien,
  DiemDanh,
} = require("../models");
const { mapStudentClasses } = require("../mappers/mapperData");

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

//Student
const getClassesByStudent = async (studentId, semester) => {
  try {
    console.log("studentId", studentId);
    const semesterRes = await semesterService.getCurrentSemester();

    const currentSemester = semesterRes?.data?.ma_ky;

    const classes = await SinhVien.findOne({
      where: {
        ma_sinh_vien: studentId,
      },
      attributes: ["ma_sinh_vien", "ten"],
      include: {
        model: DangKy,
        as: "dang_ky",
        attributes: ["id", "ma_lop_hoc_phan"],
        include: {
          model: Tkb,
          as: "thong_tin_tkb",
          where: {
            ma_ky: semester || currentSemester,
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
              model: GiangVien,
              as: "giang_vien",
              attributes: ["ten", "ma_giang_vien"],
            },
            {
              model: TkbChiTiet,
              as: "thoi_khoa_bieu_chi_tiet",
              attributes: ["id", "bat_dau", "ket_thuc", "thu", "phong"],
            },
            {
              model: HocPhan,
              as: "hoc_phan",
              attributes: ["ten_hoc_phan", "ma_hoc_phan"],
            },
          ],
        },
      },
    });
    console.log(mapStudentClasses(classes));
    return {
      status: "Ok",
      code: 200,
      data: mapStudentClasses(classes),
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

const getClassByStudentAndId = async (studentId, classCode) => {
  try {
    const semesterRes = await semesterService.getCurrentSemester();
    const currentSemester = semesterRes?.data?.ma_ky;

    const classInfo = await DangKy.findOne({
      where: {
        ma_lop_hoc_phan: classCode,
        ma_sinh_vien: studentId,
      },
      attributes: ["id", "ma_lop_hoc_phan"],
      include: {
        model: Tkb,
        as: "thong_tin_tkb",
        where: {
          ma_ky: currentSemester,
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
            model: GiangVien,
            as: "giang_vien",
            attributes: ["ten", "ma_giang_vien"],
          },
          {
            model: TkbChiTiet,
            as: "thoi_khoa_bieu_chi_tiet",
            attributes: ["id", "bat_dau", "ket_thuc", "thu", "phong"],
          },
          {
            model: HocPhan,
            as: "hoc_phan",
            attributes: ["ten_hoc_phan", "ma_hoc_phan"],
          },
        ],
      },
    });

    if (!classInfo) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy lớp học phần",
      };
    }

    return {
      status: "Ok",
      code: 200,
      data: classInfo,
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
  getStudentById,
  getClassesByStudent,
  getClassByStudentAndId,
};
