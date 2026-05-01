const {
  Tkb,
  BuoiHoc,
  DiemDanh,
  SinhVien,
  DangKy,
  ChuyenCan,
} = require("../models/index");
const { mapAttendanceByClass } = require("../mappers/mapperData");
const { sequelize } = require("../config/db");
const { where, Op } = require("sequelize");

const getAttendanceByClass = async (classCode) => {
  try {
    const today = new Date().toLocaleDateString("en-CA");
    // const today = "2025-05-01";
    const tkb = await Tkb.findOne({
      where: {
        ma_lop_hoc_phan: classCode,
      },
    });
    if (!tkb) {
      return {
        status: "Err",
        code: 404,
        message: "Không tìm thấy lớp học phần với mã lớp học phần đã cung cấp",
      };
    }

    const pastSessions = await BuoiHoc.findAll({
      where: { tkb_id: tkb.id, ngay_hoc: { [Op.lte]: today } },
      order: [["ngay_hoc", "ASC"]],
    });

    const sessionIds = pastSessions.map((session) => session.id);

    const listDangky = await DangKy.findAll({
      where: { ma_lop_hoc_phan: classCode },
      attributes: ["sinh_vien_id"],
    });

    const studentIds = listDangky.map((dk) => dk.sinh_vien_id);

    let existingAttendance = [];
    if (studentIds.length > 0 && sessionIds.length > 0) {
      existingAttendance = await DiemDanh.findAll({
        where: {
          sinh_vien_id: studentIds,
          buoi_hoc_id: sessionIds,
        },
        attributes: ["sinh_vien_id", "buoi_hoc_id"],
      });
    }

    const existingSet = new Set(
      existingAttendance.map((att) => `${att.sinh_vien_id}_${att.buoi_hoc_id}`),
    );

    const newRecords = [];
    for (const sessionId of sessionIds) {
      for (const studentId of studentIds) {
        if (!existingSet.has(`${studentId}_${sessionId}`)) {
          newRecords.push({
            sinh_vien_id: studentId,
            buoi_hoc_id: sessionId,
            diem_so: 10,
            thoi_gian_diem_danh: new Date(),
          });
        }
      }
    }
    if (newRecords.length > 0) {
      await DiemDanh.bulkCreate(newRecords, { ignoreDuplicates: true });
    }

    const data = await DangKy.findAll({
      where: { ma_lop_hoc_phan: classCode },
      include: [
        {
          model: SinhVien,
          as: "sinh_vien",
          attributes: ["ma_sinh_vien", "ten", "lop_chuyen_nganh"],
          include: {
            model: DiemDanh,
            as: "lich_su_diem_danh",

            where:
              sessionIds.length > 0
                ? { buoi_hoc_id: sessionIds }
                : { buoi_hoc_id: -1 },
            required: false,
          },
        },
      ],
      order: [[{ model: SinhVien, as: "sinh_vien" }, "ten", "ASC"]],
    });

    const attendance = mapAttendanceByClass(data);

    return {
      status: "Ok",
      code: 200,
      data: { attendance },
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

const updateAttendanceByClass = async (attendanceData) => {
  const t = await sequelize.transaction();
  try {
    console.log("attendanceData", attendanceData);
    const update = attendanceData.map((item) => {
      return DiemDanh.update(
        {
          diem_so: item.diem_so,
          ghi_chu: item.ghi_chu,
          thoi_gian_diem_danh: item.thoi_gian_diem_danh,
        },
        {
          where: { id: item.id },
          transaction: t,
        },
      );
    });

    await Promise.all(update);

    const diemDanhIds = attendanceData.map((item) => item.id);
    console.log("diemDanhIds :", diemDanhIds);
    const attendances = await DiemDanh.findAll({
      where: { id: diemDanhIds },
      attributes: [
        "id",
        "sinh_vien_id",
        "buoi_hoc_id",
        "diem_so",
        "ghi_chu",
        "thoi_gian_diem_danh",
      ],
      include: [
        {
          model: SinhVien,
          as: "sinh_vien",
          attributes: ["id", "ma_sinh_vien", "ten"],
        },
        {
          model: BuoiHoc,
          as: "buoi_hoc",
          attributes: ["id", "tkb_id", "ngay_hoc"],
          include: {
            model: Tkb,
            as: "thoi_khoa_bieu",
            attributes: ["id", "ma_lop_hoc_phan"],
            include: {
              model: DangKy,
              as: "danh_sach_dang_ky",
              attributes: ["id", "sinh_vien_id", "ma_lop_hoc_phan"],
              where: sequelize.where(
                sequelize.col(
                  "buoi_hoc->thoi_khoa_bieu->danh_sach_dang_ky.sinh_vien_id",
                ),
                Op.eq,
                sequelize.col("DiemDanh.sinh_vien_id"),
              ),
              required: false,
            },
          },
        },
      ],
      transaction: t,
    });

    console.log("attendances :", attendances);

    const dangKyIds = attendances
      .map((att) => att.buoi_hoc?.thoi_khoa_bieu?.danh_sach_dang_ky)
      .flat()
      .filter((dk) => dk !== null)
      .map((dk) => dk.id);

    console.log(dangKyIds);

    for (const dkId of dangKyIds) {
      console.log(dkId);
      const attendanceRecord = attendances.find((att) =>
        att.buoi_hoc?.thoi_khoa_bieu?.danh_sach_dang_ky?.some(
          (dk) => dk.id === dkId,
        ),
      );
      const tkbId = attendanceRecord?.buoi_hoc?.thoi_khoa_bieu?.id;
      const sinhVienId = attendanceRecord?.sinh_vien_id;

      const allScores = await DiemDanh.findAll({
        where: { sinh_vien_id: sinhVienId },
        include: [
          {
            model: BuoiHoc,
            as: "buoi_hoc",
            where: { tkb_id: tkbId },
            required: true,
          },
        ],
        transaction: t,
      });

      const totalScore = allScores.reduce(
        (sum, s) => sum + parseFloat(s.diem_so),
        0,
      );
      const avg = allScores.length > 0 ? totalScore / allScores.length : 0;
      console.log(
        `DangKy ID: ${dkId}, Total Score: ${totalScore}, Average: ${avg}`,
      );
      await ChuyenCan.upsert(
        { dang_ky_id: dkId, diem_trung_binh: avg.toFixed(2) },
        { transaction: t },
      );
    }

    await t.commit();
    return {
      status: "Ok",
      code: 200,
      message: "Cập nhật điểm danh thành công",
      data: { attendances },
    };
  } catch (e) {
    console.log(e);
    await t.rollback();
    return {
      status: "Err",
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại sau",
    };
  }
};

module.exports = {
  getAttendanceByClass,
  updateAttendanceByClass,
};

// const tkb = await Tkb.findOne({
//   where: {
//     ma_lop_hoc_phan: classCode,
//   },
// });
// if (!tkb) {
//   return {
//     status: "Err",
//     code: 404,
//     message: "Không tìm thấy lớp học phần với mã lớp học phần đã cung cấp",
//   };
// }

// const sessions = await BuoiHoc.findAll({
//   where: { tkb_id: tkb.id },
//   order: [["ngay_hoc", "ASC"]],
//   include: {
//     model: DiemDanh,
//     as: "ket_qua_diem_danh",
//     include: {
//       model: SinhVien,
//       as: "sinh_vien",
//       attributes: ["ma_sinh_vien", "ten", "lop_chuyen_nganh"],
//     },
//   },
// });
// const attendance = mapAttendanceByClass(sessions);
