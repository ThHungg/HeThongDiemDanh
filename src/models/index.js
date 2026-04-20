const SinhVien = require("./SinhVien");
const GiangVien = require("./GiangVien");
const Ky = require("./Ky");
const HocPhan = require("./HocPhan");
const Tkb = require("./ThoiKhoaBieu");
const TkbChiTiet = require("./ThoiKhoaBieuChiTiet");
const DangKy = require("./DangKy");
// const DiemDanh = require("./DiemDanh");

// 1. Mối quan hệ Học kỳ - Thời khóa biểu (1 - n)
Ky.hasMany(Tkb, { foreignKey: "ma_ky", sourceKey: "ma_ky" });
Tkb.belongsTo(Ky, { foreignKey: "ma_ky", targetKey: "ma_ky" });

// 2. Mối quan hệ Giảng viên - Thời khóa biểu (1 - n)
GiangVien.hasMany(Tkb, {
  foreignKey: "ma_giang_vien",
  sourceKey: "ma_giang_vien",
});
Tkb.belongsTo(GiangVien, {
  foreignKey: "ma_giang_vien",
  targetKey: "ma_giang_vien",
});

// 3. Mối quan hệ Học phần - Thời khóa biểu (1 - n)
HocPhan.hasMany(Tkb, { foreignKey: "ma_hoc_phan", sourceKey: "ma_hoc_phan" });
Tkb.belongsTo(HocPhan, {
  foreignKey: "ma_hoc_phan",
  targetKey: "ma_hoc_phan",
});

// 4. Mối quan hệ Tkb tổng - Tkb chi tiết (1 - n)
Tkb.hasMany(TkbChiTiet, { foreignKey: "tkb_id" });
TkbChiTiet.belongsTo(Tkb, { foreignKey: "tkb_id" });

// 5. Mối quan hệ Sinh viên - Đăng ký (1 - n)
SinhVien.hasMany(DangKy, { foreignKey: "sinh_vien_id" });
DangKy.belongsTo(SinhVien, { foreignKey: "sinh_vien_id" });

// 6. Mối quan hệ quan trọng cho Điểm danh (Trục dọc: Sinh viên)
//   SinhVien.hasMany(DiemDanh, {
//     foreignKey: "ma_sinh_vien",
//     sourceKey: "ma_sinh_vien",
//   });
//   DiemDanh.belongsTo(SinhVien, {
//     foreignKey: "ma_sinh_vien",
//     targetKey: "ma_sinh_vien",
//   });

// 7. Mối quan hệ quan trọng cho Điểm danh (Trục ngang: Buổi học)
//   TkbChiTiet.hasMany(DiemDanh, { foreignKey: "tkb_chi_tiet_id" });
//   DiemDanh.belongsTo(TkbChiTiet, { foreignKey: "tkb_chi_tiet_id" });

// 8. Giảng viên chấm điểm (Để biết ai nhập điểm)
//   GiangVien.hasMany(DiemDanh, {
//     foreignKey: "ma_giang_vien",
//     sourceKey: "ma_giang_vien",
//   });
//   DiemDanh.belongsTo(GiangVien, {
//     foreignKey: "ma_giang_vien",
//     targetKey: "ma_giang_vien",
//   });

module.exports = {
  SinhVien,
  GiangVien,
  Ky,
  HocPhan,
  Tkb,
  TkbChiTiet,
  DangKy,
  // DiemDanh,
};
