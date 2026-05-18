const SinhVien = require("./SinhVien");
const GiangVien = require("./GiangVien");
const Ky = require("./Ky");
const HocPhan = require("./HocPhan");
const Tkb = require("./ThoiKhoaBieu");
const TkbChiTiet = require("./ThoiKhoaBieuChiTiet");
const DangKy = require("./DangKy");
const BuoiHoc = require("./BuoiHoc");
const DiemDanh = require("./DiemDanh");
const ChuyenCan = require("./ChuyenCan"); // Đảm bảo bạn đã tạo file này
const CaHoc = require("./CaHoc");

/**
 * 1. QUẢN LÝ THỜI KHÓA BIỂU (TKB) TỔNG QUAN
 * Các thực thể chính liên kết để tạo ra một lớp học phần
 */

// Học kỳ - Tkb (1 - n): Một học kỳ có nhiều lớp học phần
Ky.hasMany(Tkb, {
  foreignKey: "ma_ky",
  sourceKey: "ma_ky",
  as: "thoi_khoa_bieu",
});
Tkb.belongsTo(Ky, { foreignKey: "ma_ky", targetKey: "ma_ky", as: "ky" });

// Giảng viên - Tkb (1 - n): Một giảng viên dạy nhiều lớp học phần
GiangVien.hasMany(Tkb, {
  foreignKey: "ma_giang_vien",
  sourceKey: "ma_giang_vien",
  as: "thoi_khoa_bieu",
});
Tkb.belongsTo(GiangVien, {
  foreignKey: "ma_giang_vien",
  targetKey: "ma_giang_vien",
  as: "giang_vien",
});

// Học phần - Tkb (1 - n): Một học phần (môn học) có thể mở nhiều lớp
HocPhan.hasMany(Tkb, {
  foreignKey: "ma_hoc_phan",
  sourceKey: "ma_hoc_phan",
  as: "thoi_khoa_bieu",
});
Tkb.belongsTo(HocPhan, {
  foreignKey: "ma_hoc_phan",
  targetKey: "ma_hoc_phan",
  as: "hoc_phan",
});

/**
 * 2. CHI TIẾT LỊCH HỌC VÀ ĐĂNG KÝ
 * Phân rã TKB tổng thành lịch hàng tuần và danh sách sinh viên
 */

// Tkb tổng - Tkb chi tiết (1 - n): Một lớp học phần có nhiều tiết học (Thứ/Ca) trong tuần
Tkb.hasMany(TkbChiTiet, {
  foreignKey: "tkb_id",
  as: "thoi_khoa_bieu_chi_tiet",
});
TkbChiTiet.belongsTo(Tkb, { foreignKey: "tkb_id", as: "thoi_khoa_bieu" });

// Sinh viên - Đăng ký (1 - n): Một sinh viên đăng ký nhiều lớp học phần
SinhVien.hasMany(DangKy, { foreignKey: "sinh_vien_id", as: "dang_ky" });
DangKy.belongsTo(SinhVien, { foreignKey: "sinh_vien_id", as: "sinh_vien" });

// Tkb tổng - Đăng ký (1 - n): Kết nối qua ma_lop_hoc_phan để lấy danh sách lớp
Tkb.hasMany(DangKy, {
  foreignKey: "ma_lop_hoc_phan",
  sourceKey: "ma_lop_hoc_phan",
  as: "danh_sach_dang_ky",
});
DangKy.belongsTo(Tkb, {
  foreignKey: "ma_lop_hoc_phan",
  targetKey: "ma_lop_hoc_phan",
  as: "thong_tin_tkb",
});

/**
 * 3. HỆ THỐNG BUỔI HỌC THỰC TẾ (SESSIONS)
 * Phẳng hóa lịch học từ TKB hàng tuần sang các ngày cụ thể trong năm
 */

// Tkb tổng - Buổi học (1 - n): Một lớp học phần có nhiều buổi học thực tế theo ngày
Tkb.hasMany(BuoiHoc, { foreignKey: "tkb_id", as: "cac_buoi_hoc" });
BuoiHoc.belongsTo(Tkb, { foreignKey: "tkb_id", as: "thoi_khoa_bieu" });

// Tkb chi tiết - Buổi học (1 - n): Một tiết học định kỳ sinh ra nhiều buổi học thực tế
TkbChiTiet.hasMany(BuoiHoc, {
  foreignKey: "tkb_chi_tiet_id",
  as: "lich_buoi_hoc",
});
BuoiHoc.belongsTo(TkbChiTiet, {
  foreignKey: "tkb_chi_tiet_id",
  as: "chi_tiet_tiet_hoc",
});

/**
 * 4. HỆ THỐNG ĐIỂM DANH (ATTENDANCE)
 * Lưu vết sự hiện diện của sinh viên trong từng buổi học
 */

// Buổi học - Điểm danh (1 - n): Một buổi học có danh sách điểm danh cho cả lớp
BuoiHoc.hasMany(DiemDanh, {
  foreignKey: "buoi_hoc_id",
  as: "ket_qua_diem_danh",
});
DiemDanh.belongsTo(BuoiHoc, { foreignKey: "buoi_hoc_id", as: "buoi_hoc" });

// Sinh viên - Điểm danh (1 - n): Một sinh viên có lịch sử điểm danh qua nhiều buổi
SinhVien.hasMany(DiemDanh, {
  foreignKey: "sinh_vien_id",
  as: "lich_su_diem_danh",
});
DiemDanh.belongsTo(SinhVien, { foreignKey: "sinh_vien_id", as: "sinh_vien" });

// Giảng viên - Điểm danh (1 - n): Lưu vết giảng viên nào đã thực hiện xác nhận điểm danh
GiangVien.hasMany(DiemDanh, {
  foreignKey: "ma_giang_vien",
  sourceKey: "ma_giang_vien",
  as: "lich_su_xac_nhan",
});
DiemDanh.belongsTo(GiangVien, {
  foreignKey: "ma_giang_vien",
  targetKey: "ma_giang_vien",
  as: "nguoi_xac_nhan",
});

// Đăng ký - ChuyenCan (1 - 1): Một lượt đăng ký lớp học có 1 bản ghi tổng kết điểm
DangKy.hasOne(ChuyenCan, {
  foreignKey: "dang_ky_id",
  as: "chuyen_can",
});

ChuyenCan.belongsTo(DangKy, {
  foreignKey: "dang_ky_id",
  as: "dang_ky",
});

TkbChiTiet.belongsTo(CaHoc, {
  foreignKey: "bat_dau",
  as: "ca_bat_dau",
});

// Tiết kết thúc liên kết với ca học
TkbChiTiet.belongsTo(CaHoc, {
  foreignKey: "ket_thuc",
  as: "ca_ket_thuc",
});

module.exports = {
  SinhVien,
  GiangVien,
  Ky,
  HocPhan,
  Tkb,
  TkbChiTiet,
  DangKy,
  BuoiHoc,
  DiemDanh,
  ChuyenCan,
  CaHoc,
};
