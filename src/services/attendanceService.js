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
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const calculateAndUpdateChuyenCan = async (classCode, transaction = null) => {
  try {
    const tkb = await Tkb.findOne({
      where: { ma_lop_hoc_phan: classCode },
    });

    if (!tkb) return;

    const listDangky = await DangKy.findAll({
      where: { ma_lop_hoc_phan: classCode },
    });

    for (const dk of listDangky) {
      const sinhVienId = dk.sinh_vien_id;

      const allScores = await DiemDanh.findAll({
        where: { sinh_vien_id: sinhVienId },
        include: [
          {
            model: BuoiHoc,
            as: "buoi_hoc",
            attributes: ["tkb_id"],
            where: { tkb_id: tkb.id },
            required: true,
          },
        ],
        transaction,
      });

      if (allScores.length > 0) {
        const totalScore = allScores.reduce(
          (sum, s) => sum + parseFloat(s.diem_so),
          0,
        );
        const avg = (totalScore / allScores.length).toFixed(2);
        console.log(avg);
        console.log("totalScore", totalScore);

        // Thử update trước, nếu không có record thì tạo mới
        const [updated] = await ChuyenCan.update(
          { diem_trung_binh: avg },
          { where: { dang_ky_id: dk.id }, transaction },
        );
        if (updated === 0) {
          await ChuyenCan.create(
            { dang_ky_id: dk.id, diem_trung_binh: avg },
            { transaction },
          );
        }
      }
    }
  } catch (e) {
    console.log("Error calculating ChuyenCan:", e);
  }
};

const getAttendanceByClass = async (classCode) => {
  try {
    // const today = new Date().toLocaleDateString("en-CA");
    const today = "2026-02-04";
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
      // Tính lại điểm trung bình sau khi auto-assign
      await calculateAndUpdateChuyenCan(classCode);
    }

    const data = await DangKy.findAll({
      where: { ma_lop_hoc_phan: classCode },
      include: [
        {
          model: SinhVien,
          as: "sinh_vien",
          attributes: [
            "ma_sinh_vien",
            "ten",
            "lop_chuyen_nganh",
            "email1",
            "email2",
          ],
          include: {
            model: DiemDanh,
            as: "lich_su_diem_danh",
            where:
              sessionIds.length > 0
                ? { buoi_hoc_id: sessionIds }
                : { buoi_hoc_id: -1 },
            required: false,
            order: [["buoi_hoc_id", "ASC"]],
          },
        },
        {
          model: ChuyenCan,
          as: "chuyen_can",
          attributes: ["diem_trung_binh"],
          required: false,
        },
      ],
      order: [[{ model: SinhVien, as: "sinh_vien" }, "ten", "ASC"]],
    });

    const attendance = mapAttendanceByClass(data);

    return {
      status: "Ok",
      code: 200,
      data: {
        attendance,
        pastSessions: pastSessions.map((s) => ({
          id: s.id,
          ngay_hoc: s.ngay_hoc,
        })),
        sessionIds,
      },
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

    const dangKyIds = attendances
      .map((att) => att.buoi_hoc?.thoi_khoa_bieu?.danh_sach_dang_ky)
      .flat()
      .filter((dk) => dk !== null)
      .map((dk) => dk.id);

    // Unique dangKyIds để tránh tính lại nhiều lần cho cùng 1 sinh viên
    const uniqueDangKyIds = [...new Set(dangKyIds)];

    console.log("uniqueDangKyIds :", uniqueDangKyIds);

    for (const dkId of uniqueDangKyIds) {
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
      console.log();

      // Thử update trước, nếu không có record thì tạo mới
      const [updated] = await ChuyenCan.update(
        { diem_trung_binh: avg.toFixed(2) },
        { where: { dang_ky_id: dkId }, transaction: t },
      );
      if (updated === 0) {
        await ChuyenCan.create(
          { dang_ky_id: dkId, diem_trung_binh: avg.toFixed(2) },
          { transaction: t },
        );
      }
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

// ============ EXPORT EXCEL ============
const exportAttendanceToExcel = async (classCode) => {
  try {
    // Lấy dữ liệu sinh viên và điểm danh
    const response = await getAttendanceByClass(classCode);

    if (response.status !== "Ok") {
      return response;
    }

    const attendance = response.data.attendance;
    const pastSessions = response.data.pastSessions || [];

    // Tạo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Điểm danh");

    // Tạo header với dynamic columns cho mỗi buổi học
    const columns = [
      { header: "STT", key: "stt", width: 5 },
      { header: "Mã SV", key: "ma_sinh_vien", width: 12 },
      { header: "Họ tên", key: "ten", width: 25 },
      { header: "Lớp", key: "lop_chuyen_nganh", width: 15 },
      ...pastSessions.map((session) => ({
        header: new Date(session.ngay_hoc).toLocaleDateString("vi-VN"),
        key: `session_${session.id}`,
        width: 8,
      })),
      { header: "ĐTB", key: "diem_trung_binh", width: 8 },
    ];

    worksheet.columns = columns;

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0070C0" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "center" };

    // Thêm dữ liệu
    let rowNumber = 2;
    attendance.forEach((item, index) => {
      // Tạo map để quick lookup điểm theo buoiHocId
      const diemMap = {};
      if (item.lichSuDiemDanh) {
        item.lichSuDiemDanh.forEach((d) => {
          diemMap[d.buoiHocId] = d.diemSo;
        });
      }

      const rowData = {
        stt: index + 1,
        ma_sinh_vien: item.maSinhVien,
        ten: item.ten,
        lop_chuyen_nganh: item.lopChuyenNganh,
      };

      // Thêm điểm cho mỗi buổi học
      pastSessions.forEach((session) => {
        const diem = diemMap[session.id];
        rowData[`session_${session.id}`] = diem !== undefined ? diem : "";
      });

      rowData.diem_trung_binh = item.diemTrungBinh || 0;

      const row = worksheet.addRow(rowData);

      // Style dữ liệu
      row.getCell("stt").alignment = { horizontal: "center" };

      // Style điểm theo từng buổi - màu xanh nếu 10, đỏ nếu < 10
      pastSessions.forEach((session) => {
        const cell = row.getCell(`session_${session.id}`);
        cell.alignment = { horizontal: "center" };
        const diem = diemMap[session.id];
        if (diem !== undefined) {
          if (diem === 10) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFC6EFCE" },
            };
          } else if (diem < 10) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFC7CE" },
            };
          }
        }
      });

      row.getCell("diem_trung_binh").alignment = { horizontal: "center" };
      rowNumber++;
    });

    // Tạo folder exports nếu chưa có
    const exportsDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Lưu file
    const fileName = `DiemDanh_${classCode}_${Date.now()}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    await workbook.xlsx.writeFile(filePath);

    console.log("✅ Export thành công:", filePath);

    return {
      status: "Ok",
      code: 200,
      message: "Xuất file thành công",
      data: {
        fileName: fileName,
        filePath: filePath,
      },
    };
  } catch (e) {
    console.log("❌ Export error:", e);
    return {
      status: "Err",
      code: 500,
      message: "Lỗi xuất file",
    };
  }
};

module.exports = {
  getAttendanceByClass,
  updateAttendanceByClass,
  calculateAndUpdateChuyenCan,
  exportAttendanceToExcel,
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
