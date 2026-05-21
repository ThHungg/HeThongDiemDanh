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
  ChuyenCan,
} = require("../models");
const {
  mapStudentClasses,
  mapStudents,
  mapAttendanceByStudent,
} = require("../mappers/mapperData");
const { Op, where } = require("sequelize");

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

const getAllStudents = async (
  semester,
  page,
  limit,
  search,
  startDate,
  endDate,
  minScore,
  maxScore,
) => {
  try {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    const semesterRes = await semesterService.getCurrentSemester();
    const currentSemester = semesterRes?.data?.ma_ky;

    const whereCondition = {};

    if (search) {
      // Check if search contains multiple student IDs (format: A46588 A46615 A46623)
      const studentIdRegex = /A\d{5}/g;
      const studentIds = search.match(studentIdRegex);

      if (studentIds && studentIds.length > 0) {
        // Multiple student IDs found - use IN condition
        whereCondition[Op.or] = [{ ma_sinh_vien: { [Op.in]: studentIds } }];
      } else {
        // Single search term - search in multiple fields
        whereCondition[Op.or] = [
          { ma_sinh_vien: { [Op.like]: `%${search}%` } },
          { ten: { [Op.like]: `%${search}%` } },
          { lop_chuyen_nganh: { [Op.like]: `%${search}%` } },
        ];
      }
    }

    const queryOptions = {
      where: whereCondition,
      attributes: [
        "ma_sinh_vien",
        "ten",
        "lop_chuyen_nganh",
        "dien_thoai1",
        "dien_thoai2",
        "email1",
        "email2",
      ],
      include: [
        {
          model: DangKy,
          as: "dang_ky",
          required: false,
          attributes: ["id", "ma_lop_hoc_phan", "ma_ky"],
          where: {
            ma_ky: semester || currentSemester,
          },
          include: [
            {
              model: ChuyenCan,
              as: "chuyen_can",
              attributes: ["id", "dang_ky_id", "diem_trung_binh"],
              required: false,
            },
            {
              model: Tkb,
              as: "thong_tin_tkb",
              attributes: [
                "id",
                "ma_lop_hoc_phan",
                "ma_hoc_phan",
                "ten_lop",
                "sldk",
                "suc_chua",
              ],
              required: false,
              include: [
                {
                  model: GiangVien,
                  as: "giang_vien",
                  attributes: ["ten", "ma_giang_vien"],
                },
                {
                  model: HocPhan,
                  as: "hoc_phan",
                  attributes: ["ten_hoc_phan", "ma_hoc_phan"],
                },
              ],
            },
          ],
        },
        {
          model: DiemDanh,
          as: "lich_su_diem_danh",
          attributes: ["id", "buoi_hoc_id", "sinh_vien_id", "diem_so"],
          required: false,
          include: [
            {
              model: BuoiHoc,
              as: "buoi_hoc",
              attributes: ["id", "tkb_id", "ngay_hoc", "trang_thai"],
              required: false,
              where:
                startDate && endDate
                  ? {
                      ngay_hoc: {
                        [Op.between]: [startDate, endDate],
                      },
                    }
                  : undefined,
            },
          ],
        },
      ],
      order: [["ma_sinh_vien", "ASC"]],
    };

    const rows = await SinhVien.findAll(queryOptions);

    let mappedStudents = mapStudents(
      rows,
      !!(startDate && endDate),
      startDate,
      endDate,
      minScore,
      maxScore,
    );

    const totalRecords = mappedStudents.length;
    mappedStudents = mappedStudents.slice(offset, offset + limitNumber);

    const totalPages = Math.ceil(totalRecords / limitNumber);
    return {
      status: "Ok",
      code: 200,
      data: mappedStudents,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalRecords: totalRecords,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    };
  } catch (e) {
    console.error("getAllStudents error:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getClassesByStudentId = async (studentId, semester) => {
  try {
    const semesterRes = await semesterService.getCurrentSemester();
    const currentSemester = semesterRes?.data?.ma_ky;

    // Lấy thông tin sinh viên
    const student = await SinhVien.findOne({
      where: {
        ma_sinh_vien: studentId,
      },
      attributes: [
        "ma_sinh_vien",
        "ten",
        "lop_chuyen_nganh",
        "dien_thoai1",
        "dien_thoai2",
        "email1",
      ],
    });

    if (!student) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy sinh viên",
      };
    }

    // Lấy danh sách lớp học đã đăng ký
    const classes = await DangKy.findAll({
      where: {
        msv: studentId,
        ma_ky: semester || currentSemester,
      },
      attributes: ["id", "ma_lop_hoc_phan", "ma_hoc_phan"],
      include: [
        {
          model: ChuyenCan,
          as: "chuyen_can",
          attributes: ["id", "dang_ky_id", "diem_trung_binh"],
        },
        {
          model: Tkb,
          as: "thong_tin_tkb",
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
      ],
    });

    // Truyền data đúng format vào mapper
    const mappedData = mapStudentClasses({
      ma_sinh_vien: student.ma_sinh_vien,
      ten: student.ten,
      lop_chuyen_nganh: student.lop_chuyen_nganh,
      dien_thoai1: student.dien_thoai1,
      dien_thoai2: student.dien_thoai2,
      email1: student.email1,
      dang_ky: classes,
    });

    return {
      status: "Ok",
      code: 200,
      data: mappedData,
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

const getAttendanceByStudentId = async (studentId, semester, classCode) => {
  try {
    console.log(studentId, semester, classCode);
    const student = await SinhVien.findOne({
      where: {
        ma_sinh_vien: studentId,
      },
      attributes: ["id", "ma_sinh_vien", "ten"],
    });
    if (!student) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy sinh viên",
      };
    }

    const semesterRes = await semesterService.getCurrentSemester();
    const currentSemester = semesterRes?.data?.ma_ky;

    const tkbWhere = {
      ma_ky: semester || currentSemester,
    };
    if (classCode) {
      tkbWhere.ma_lop_hoc_phan = classCode;
    }

    const attendance = await DiemDanh.findAll({
      where: {
        sinh_vien_id: student.id,
      },
      include: [
        {
          model: BuoiHoc,
          as: "buoi_hoc",
          attributes: ["id", "tkb_id", "ngay_hoc", "trang_thai"],
          include: [
            {
              model: Tkb,
              as: "thoi_khoa_bieu",
              attributes: ["id", "ma_ky", "ma_lop_hoc_phan"],
              where: tkbWhere,
              required: true,
            },
            {
              model: TkbChiTiet,
              as: "chi_tiet_tiet_hoc",
              attributes: ["id", "bat_dau", "ket_thuc", "thu", "phong"],
            },
          ],
          required: true,
        },
      ],
      subQuery: false,
    });

    const mapData = mapAttendanceByStudent(attendance);
    return {
      status: "Ok",
      code: 200,
      data: mapData,
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
  getAllStudents,
  getClassesByStudentId,
  getAttendanceByStudentId,
};
