const { Tkb, BuoiHoc, DiemDanh, SinhVien, DangKy } = require("../models/index");
const { mapAttendanceByClass } = require("../mappers/mapperData");
const { sequelize } = require("../config/db");
const { where } = require("sequelize");

const getAttendanceByClass = async (classCode) => {
  try {
    const Dangky = await DangKy.findAll({
      where: {
        ma_lop_hoc_phan: classCode,
      },
      include: [
        {
          model: SinhVien,
          as: "sinh_vien",
          attributes: ["ma_sinh_vien", "ten", "lop_chuyen_nganh"],
          include: {
            model: DiemDanh,
            as: "lich_su_diem_danh",
          },
        },
      ],
      order: [[{ model: SinhVien, as: "sinh_vien" }, "id", "ASC"]],
    });

    const attendance = mapAttendanceByClass(Dangky);

    return {
      status: "Ok",
      code: 200,
      data: {
        attendance,
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

    await t.commit();
    return {
      status: "Ok",
      code: 200,
      message: "Cập nhật điểm danh thành công",
    };
  } catch (e) {
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
