const { or, Op, where, col, Sequelize } = require("sequelize");
const {
  mapClasses,
  mapClassInfo,
  mapSessions,
  mapStudentClasses,
  mapStudents,
} = require("../mappers/mapperData");
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
  CaHoc,
} = require("../models");
const { getAttendanceDates } = require("../utils/dateHelper");
const { sendEmailToStudent, sendEmail } = require("../utils/sendEmail");

const semesterService = require("./semesterService");
const cacheService = require("./cacheService");
const { emailQueue } = require("./mailQueueService");
const CoVanHocTap = require("../models/CoVanHocTap");

const getClassesByLecturer = async (lecturerId, semester) => {
  try {
    let currentSemester;
    if (semester) {
      currentSemester = semester;
    } else {
      const semesterRes = await semesterService.getCurrentSemester();
      currentSemester = semesterRes?.data?.ma_ky;
    }

    // Check cache first
    const cacheKey = cacheService.CACHE_KEYS.LECTURER_CLASSES(
      lecturerId,
      currentSemester,
    );
    const cachedResult = await cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

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
          model: GiangVien,
          as: "giang_vien",
          attributes: ["ten", "ma_giang_vien"],
        },
        {
          model: HocPhan,
          as: "hoc_phan",
          attributes: ["ten_hoc_phan", "ma_hoc_phan"],
        },
        {
          model: TkbChiTiet,
          as: "thoi_khoa_bieu_chi_tiet",
          attributes: ["bat_dau", "ket_thuc", "thu", "phong"],
        },
      ],
      order: [["id", "DESC"]],
    });
    const transformedClasses = mapClasses(classes);

    const result = {
      status: "Ok",
      code: 200,
      data: transformedClasses,
    };

    // Cache for 30 minutes
    await cacheService.set(cacheKey, result, cacheService.CACHE_TTL.MEDIUM);

    return result;
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getClassByLecturerAndId = async (lecturerId, classCode) => {
  try {
    const semesterRes = await semesterService.getCurrentSemester();
    const currentSemester = semesterRes?.data;
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
          model: GiangVien,
          as: "giang_vien",
          attributes: ["ten", "ma_giang_vien"],
        },
        {
          model: DangKy,
          as: "danh_sach_dang_ky",
          attributes: ["id", "sinh_vien_id"],
          required: false, // LEFT JOIN
          include: [
            {
              model: SinhVien,
              as: "sinh_vien",
              orders: [["id", "DESC"]],
              attributes: [
                "ma_sinh_vien",
                "ten",
                "lop_chuyen_nganh",
                "email1",
                "email2",
              ],
            },
            {
              model: ChuyenCan,
              as: "chuyen_can",
              attributes: ["diem_trung_binh"],
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
          attributes: ["id", "bat_dau", "ket_thuc", "thu", "phong"],
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
      order: [
        [
          { model: DangKy, as: "danh_sach_dang_ky" },
          { model: SinhVien, as: "sinh_vien" },
          "id",
          "ASC",
        ],
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
          attributes: ["id", "bat_dau", "ket_thuc", "thu", "phong"],
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
        classInfo,
      },
    };
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getAllClasses = async (options = {}) => {
  try {
    const { semester, page = 1, limit = 10, lecturerId, searchText } = options;
    let currentSemester;
    if (semester) {
      currentSemester = semester;
    } else {
      const semesterRes = await semesterService.getCurrentSemester();
      currentSemester = semesterRes?.data?.ma_ky;
    }

    // Check cache first - include pagination and filters in cache key
    const cacheKey = cacheService.CACHE_KEYS.ALL_CLASSES(
      currentSemester,
      page,
      limit,
      lecturerId,
      searchText,
    );
    const cachedResult = await cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const whereConditions = [];

    // Add semester condition
    if (currentSemester) {
      whereConditions.push({ ma_ky: currentSemester });
    }

    // Add lecturer filter
    if (lecturerId) {
      whereConditions.push({ ma_giang_vien: lecturerId });
    }

    // Build search conditions
    const searchConditions = [];
    if (searchText) {
      searchConditions.push({
        ma_lop_hoc_phan: { [Op.like]: `%${searchText}%` },
      });
      searchConditions.push({ ten_lop: { [Op.like]: `%${searchText}%` } });
    }

    const where =
      whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const offset = (page - 1) * limit;

    // Query 1: Count total distinct classes
    const count = await Tkb.count({
      where,
      distinct: true,
    });

    // Query 2: Fetch all rows (no limit here, need to dedupe manually)
    const allRows = await Tkb.findAll({
      where,
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
          attributes: ["id", "ten", "ma_giang_vien"],
        },
        {
          model: HocPhan,
          as: "hoc_phan",
          attributes: ["ten_hoc_phan", "ma_hoc_phan"],
        },
        {
          model: TkbChiTiet,
          as: "thoi_khoa_bieu_chi_tiet",
          attributes: ["bat_dau", "ket_thuc", "thu", "phong"],
        },
        {
          model: DangKy,
          as: "danh_sach_dang_ky",
          attributes: ["id", "sinh_vien_id"],
          required: false,
          include: [
            {
              model: ChuyenCan,
              as: "chuyen_can",
              attributes: ["diem_trung_binh"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
      subQuery: false,
      raw: false,
    });

    const uniqueClassesMap = new Map();
    allRows.forEach((row) => {
      if (!uniqueClassesMap.has(row.id)) {
        uniqueClassesMap.set(row.id, row);
      }
    });
    let uniqueRows = Array.from(uniqueClassesMap.values());

    // Apply search filter on client side for associated table searches
    if (searchText) {
      uniqueRows = uniqueRows.filter((row) => {
        const searchLower = searchText.toLowerCase();
        const classCode = row.ma_lop_hoc_phan?.toLowerCase() || "";
        const className = row.ten_lop?.toLowerCase() || "";
        const lecturerName = row.giang_vien?.ten?.toLowerCase() || "";
        const subjectName = row.hoc_phan?.ten_hoc_phan?.toLowerCase() || "";

        return (
          classCode.includes(searchLower) ||
          className.includes(searchLower) ||
          lecturerName.includes(searchLower) ||
          subjectName.includes(searchLower)
        );
      });
    }

    const totalCount = uniqueRows.length;
    const rows = uniqueRows.slice(offset, offset + limit);

    const dataWithClassAverage = rows.map((classData) => {
      const classObj = classData.toJSON ? classData.toJSON() : classData;

      const validScores = classObj.danh_sach_dang_ky
        .map((reg) => reg.chuyen_can?.diem_trung_binh)
        .filter((score) => score !== null && score !== undefined);

      let diem_trung_binh_lop = null;
      if (validScores.length > 0) {
        const totalScore = validScores.reduce(
          (sum, score) => sum + parseFloat(score),
          0,
        );
        diem_trung_binh_lop = parseFloat(
          (totalScore / validScores.length).toFixed(2),
        );
      }

      return {
        id: classObj.id,
        ma_lop_hoc_phan: classObj.ma_lop_hoc_phan,
        ma_hoc_phan: classObj.ma_hoc_phan,
        ten_lop: classObj.ten_lop,
        sldk: classObj.sldk,
        suc_chua: classObj.suc_chua,
        giang_vien: classObj.giang_vien,
        hoc_phan: classObj.hoc_phan,
        thoi_khoa_bieu_chi_tiet: classObj.thoi_khoa_bieu_chi_tiet,
        diem_trung_binh_lop,
        tong_sinh_vien_co_diem: validScores.length,
      };
    });

    const result = {
      status: "Ok",
      code: 200,
      data: dataWithClassAverage,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    // Cache for 30 minutes
    await cacheService.set(cacheKey, result, cacheService.CACHE_TTL.MEDIUM);

    return result;
  } catch (e) {
    console.error("getAllClasses error:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getCurrentClasses = async (lecturerId) => {
  try {
    const checkLecturer = await GiangVien.findOne({
      where: { ma_giang_vien: lecturerId },
    });
    if (!checkLecturer) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy giảng viên",
      };
    }

    const now = new Date();
    let currentHour = String(now.getHours()).padStart(2, "0");
    let currentMinute = String(now.getMinutes()).padStart(2, "0");
    let currentTime = `${currentHour}:${currentMinute}`;

    // Lấy thứ hiện tại (1-8, trong đó 8=Chủ nhật, 1=Thứ 2)
    let dayOfWeek = now.getDay();
    let currentDay = dayOfWeek === 0 ? 8 : dayOfWeek + 1;

    // ============ HARD CODE FOR TESTING ============
    currentTime = "12:30"; // Uncomment để test - Sẽ match tiết 3-6
    currentDay = 4; // Uncomment để test vào Thứ 2

    // currentTime = "14:30"; // Uncomment để test - Sẽ match tiết 6-8
    // currentDay = 4; // Uncomment để test vào Thứ 4
    // ============ END HARD CODE ============

    const semesterRes = await semesterService.getCurrentSemester();
    const currentSemester = semesterRes?.data?.ma_ky;

    if (!currentSemester) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy học kỳ hiện tại",
      };
    }

    // Lấy tất cả Ca Học để mapping
    const allCaHoc = await CaHoc.findAll({
      attributes: ["id", "gio_bat_dau", "gio_ket_thuc", "ten_ca"],
      raw: true,
    });

    // Tạo mapping từ id đến thông tin ca học
    const caHocMap = {};
    allCaHoc.forEach((ca) => {
      caHocMap[ca.id] = ca;
    });

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
          model: GiangVien,
          as: "giang_vien",
          attributes: ["ten", "ma_giang_vien"],
        },
        {
          model: HocPhan,
          as: "hoc_phan",
          attributes: ["ten_hoc_phan", "ma_hoc_phan"],
        },
        {
          model: TkbChiTiet,
          as: "thoi_khoa_bieu_chi_tiet",
          attributes: ["bat_dau", "ket_thuc", "thu", "phong"],
        },
      ],
      order: [["id", "DESC"]],
    });

    // Xử lý để thêm thông tin ca học đang diễn ra
    const classesWithCurrentSession = classes
      .map((cls) => {
        let currentCaHoc = null;

        // Kiểm tra từng tiết học xem cái nào đang diễn ra
        if (
          cls.thoi_khoa_bieu_chi_tiet &&
          cls.thoi_khoa_bieu_chi_tiet.length > 0
        ) {
          // Kiểm tra thứ trước
          const matchedSchedule = cls.thoi_khoa_bieu_chi_tiet.find((tiet) => {
            // Kiểm tra xem thứ có match không
            if (tiet.thu !== currentDay) {
              return false;
            }

            // Lấy thông tin ca học bắt đầu và kết thúc
            const caBatDau = caHocMap[tiet.bat_dau];
            const caKetThuc = caHocMap[tiet.ket_thuc];

            if (!caBatDau || !caKetThuc) {
              return false;
            }

            // So sánh thời gian: giờ hiện tại có nằm trong khoảng từ ca bắt đầu đến ca kết thúc không
            const gioBatDau = caBatDau.gio_bat_dau;
            const gioKetThuc = caKetThuc.gio_ket_thuc;

            if (currentTime >= gioBatDau && currentTime <= gioKetThuc) {
              return true;
            }
            return false;
          });

          if (matchedSchedule) {
            const caBatDau = caHocMap[matchedSchedule.bat_dau];
            const caKetThuc = caHocMap[matchedSchedule.ket_thuc];

            currentCaHoc = {
              caBatDau: caBatDau.ten_ca,
              caKetThuc: caKetThuc.ten_ca,
              gioBatDau: caBatDau.gio_bat_dau,
              gioKetThuc: caKetThuc.gio_ket_thuc,
            };
          }
        }

        return {
          maLopHocPhan: cls.ma_lop_hoc_phan,
          tenLop: cls.ten_lop,
          caCaHocHienTai: currentCaHoc,
          thoiGianHienTai: currentTime,
          thuHienTai: currentDay,
        };
      })
      .filter((classData) => classData.caCaHocHienTai !== null); // ← Thêm dòng này

    return {
      status: "Ok",
      code: 200,
      data: classesWithCurrentSession,
    };
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getAllLecturer = async () => {
  try {
    // Check cache first
    const cacheKey = cacheService.CACHE_KEYS.ALL_LECTURERS;
    const cachedResult = await cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const lecturers = await GiangVien.findAll({
      attributes: ["ma_giang_vien", "ten"],
      order: [["ten", "ASC"]],
    });

    const result = {
      status: "Ok",
      code: 200,
      data: lecturers,
    };

    // Cache for 2 hours
    await cacheService.set(cacheKey, result, cacheService.CACHE_TTL.LONG);

    return result;
  } catch (e) {
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getStudentsByAdvisor = async (advisorId, maLop, semester) => {
  try {
    let currentSemester;
    if (semester) {
      currentSemester = semester;
    } else {
      const semesterRes = await semesterService.getCurrentSemester();
      currentSemester = semesterRes?.data?.ma_ky;
    }

    if (!currentSemester) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy kỳ học hiện tại",
      };
    }

    // Verify advisor manages this class
    const advisor = await CoVanHocTap.findOne({
      where: {
        ma_giang_vien: advisorId,
        ma_lop: maLop,
        ma_ky: currentSemester,
      },
    });

    if (!advisor) {
      return {
        status: "Err",
        code: 403,
        message: "Bạn không có quyền quản lý lớp này",
      };
    }

    const students = await SinhVien.findAll({
      where: {
        lop_chuyen_nganh: maLop,
      },
      attributes: [
        "id",
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
            ma_ky: currentSemester,
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
            },
          ],
        },
      ],
      order: [["ma_sinh_vien", "ASC"]],
    });

    if (!students || students.length === 0) {
      return {
        status: "Ok",
        code: 200,
        data: [],
        pagination: {
          currentPage: 1,
          limit: 10,
          totalRecords: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // Map students data
    const mappedStudents = mapStudents(students, false);

    return {
      status: "Ok",
      code: 200,
      data: mappedStudents,
      pagination: {
        currentPage: 1,
        limit: 10,
        totalRecords: mappedStudents.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } catch (e) {
    console.error("getStudentsByAdvisor error:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

const getClassesByAdvisor = async (advisorId, semester) => {
  try {
    let currentSemester;
    if (semester) {
      currentSemester = semester;
    } else {
      const semesterRes = await semesterService.getCurrentSemester();
      currentSemester = semesterRes?.data?.ma_ky;
    }
    const advisors = await CoVanHocTap.findAll({
      where: {
        ma_giang_vien: advisorId,
        ma_ky: currentSemester,
      },
    });
    return {
      status: "Ok",
      code: 200,
      data: advisors,
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
  getClassesByLecturer,
  getClassByLecturerAndId,
  getAllClasses,
  getCurrentClasses,
  getAllLecturer,
  getStudentsByAdvisor,
  getClassesByAdvisor,
};
