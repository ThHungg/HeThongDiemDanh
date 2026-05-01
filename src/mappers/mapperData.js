// Hàm mapper danh sách lớp học
const mapClasses = (classes) => {
  return classes.map((cls) => ({
    id: cls.id,
    maLopHocPhan: cls.ma_lop_hoc_phan,
    tenLop: cls.ten_lop,
    soLuongDangKy: cls.sldk,
    sucChua: cls.suc_chua,
    giangVien: cls.giang_vien
      ? {
          ten: cls.giang_vien.ten,
          maGiangVien: cls.giang_vien.ma_giang_vien,
        }
      : null,
    hocPhan: cls.hoc_phan
      ? {
          tenHocPhan: cls.hoc_phan.ten_hoc_phan,
          maHocPhan: cls.hoc_phan.ma_hoc_phan,
        }
      : null,
    thoiKhoaBieuChiTiet: cls.thoi_khoa_bieu_chi_tiet.map((tkb) => ({
      tiet: `${tkb.bat_dau}-${tkb.ket_thuc}`,
      thu: tkb.thu,
      phong: tkb.phong,
    })),
  }));
};

// Hàm mapper thông tin chi tiết lớp học
const mapClassInfo = (classInfo) => {
  return {
    id: classInfo.id,
    maLopHocPhan: classInfo.ma_lop_hoc_phan,
    tenLop: classInfo.ten_lop,
    soLuongDangKy: classInfo.sldk,
    sucChua: classInfo.suc_chua,
    hocPhan: classInfo.hoc_phan
      ? {
          tenHocPhan: classInfo.hoc_phan.ten_hoc_phan,
          maHocPhan: classInfo.hoc_phan.ma_hoc_phan,
        }
      : null,

    thoiKhoaBieuChiTiet: classInfo.thoi_khoa_bieu_chi_tiet.map((tkb) => ({
      tkbId: tkb.id,
      //   batDau: tkb.bat_dau,
      //   ketThuc: tkb.ket_thuc,
      tiet: `${tkb.bat_dau}-${tkb.ket_thuc}`,
      thu: tkb.thu,
      phong: tkb.phong,
    })),
    ky: classInfo.ky
      ? {
          id: classInfo.ky.id,
          maKy: classInfo.ky.ma_ky,
          tenKy: classInfo.ky.ten_ky,
          maNam: classInfo.ky.ma_nam,
          batDauKyHoc: classInfo.ky.bat_dau_ky_hoc,
          ketThucKyHoc: classInfo.ky.ket_thuc_ky_hoc,
        }
      : null,
    danhSachDangKy: classInfo.danh_sach_dang_ky.map((dk) => ({
      id: dk.id,
      maSinhVien: dk.sinh_vien?.ma_sinh_vien,
      ten: dk.sinh_vien?.ten,
      lopChuyenNganh: dk.sinh_vien?.lop_chuyen_nganh,
    })),
  };
};

const mapSessions = (sessions) => {
  return sessions.map((session) => ({
    id: session.id,
    tkbId: session.tkb_id,
    tietHocId: session.tkb_chi_tiet_id,
    ngayHoc: session.ngay_hoc,
    trangThai: session.trang_thai,
    loaiBuoiHoc: session.loai_buoi_hoc,
    ghiChu: session.ghi_chu,
    chiTietTietHoc: session.chi_tiet_tiet_hoc
      ? {
          id: session.chi_tiet_tiet_hoc.id,
          tiet: `${session.chi_tiet_tiet_hoc.bat_dau}-${session.chi_tiet_tiet_hoc.ket_thuc}`,
          thu: session.chi_tiet_tiet_hoc.thu,
        }
      : null,
  }));
};

//Student
const mapStudentClasses = (studentData) => {
  return {
    maSinhVien: studentData.ma_sinh_vien,
    ten: studentData.ten,
    dangKy: studentData.dang_ky
      .filter((dk) => dk.thong_tin_tkb !== null)
      .map((dk) => ({
        id: dk.id,
        maLopHocPhan: dk.ma_lop_hoc_phan,
        giangVien: dk.thong_tin_tkb?.giang_vien
          ? {
              ten: dk.thong_tin_tkb.giang_vien.ten,
              maGiangVien: dk.thong_tin_tkb.giang_vien.ma_giang_vien,
            }
          : null,
        hocPhan: dk.thong_tin_tkb
          ? {
              maHocPhan: dk.thong_tin_tkb.ma_hoc_phan,
              tenHocPhan: dk.thong_tin_tkb.hoc_phan.ten_hoc_phan,
              tenLop: dk.thong_tin_tkb.ten_lop,
              soLuongDangKy: dk.thong_tin_tkb.sldk,
              sucChua: dk.thong_tin_tkb.suc_chua,
            }
          : null,
        thoiKhoaBieuChiTiet: dk.thong_tin_tkb
          ? dk.thong_tin_tkb.thoi_khoa_bieu_chi_tiet.map((tkb) => ({
              tiet: `${tkb.bat_dau}-${tkb.ket_thuc}`,
              thu: tkb.thu,
              phong: tkb.phong,
            }))
          : [],
      })),
  };
};

//Attendance
const mapAttendanceByClass = (sessions) => {
  return sessions.map((dk) => ({
    // Giữ nguyên các field cũ để không làm gãy UI Frontend
    id: dk.id,
    maSinhVien: dk.sinh_vien?.ma_sinh_vien,
    ten: dk.sinh_vien?.ten,
    lopChuyenNganh: dk.sinh_vien?.lop_chuyen_nganh,
    maLopHocPhan: dk.ma_lop_hoc_phan,

    // Giữ nguyên logic map cũ, chỉ fix logic parseFloat
    lichSuDiemDanh: dk.sinh_vien?.lich_su_diem_danh
      ? dk.sinh_vien.lich_su_diem_danh.map((diem) => ({
          id: diem.id,
          buoiHocId: diem.buoi_hoc_id,
          // Cách fix an toàn cho điểm 0:
          // Nếu diem_so là null/undefined thì trả về null (để frontend hiện "-")
          // Nếu có giá trị thì dùng parseFloat
          diemSo: diem.diem_so !== null ? parseFloat(diem.diem_so) : null,
          thoiGianDiemDanh: diem.thoi_gian_diem_danh,
          ghiChu: diem.ghi_chu,
          maGiangVien: diem.ma_giang_vien,
        }))
      : [],
  }));
};

module.exports = {
  mapClasses,
  mapClassInfo,
  mapSessions,
  //Student
  mapStudentClasses,
  //Attendance
  mapAttendanceByClass,
};
