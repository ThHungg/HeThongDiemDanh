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
      diemChuyenCan: dk.chuyen_can?.diem_trung_binh,
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
  console.log("studentData", studentData);
  return {
    maSinhVien: studentData.ma_sinh_vien,
    ten: studentData.ten,
    lopChuyenNganh: studentData.lop_chuyen_nganh,
    dienThoai1: studentData.dien_thoai1,
    dienThoai2: studentData.dien_thoai2,
    email1: studentData.email1,
    lopChuyenNganh: studentData.lop_chuyen_nganh,
    dienThoai1: studentData.dien_thoai1,
    dienThoai2: studentData.dien_thoai2,
    email1: studentData.email1,
    dangKy: studentData.dang_ky
      .filter((dk) => dk.thong_tin_tkb !== null)
      .map((dk) => ({
        id: dk.id,
        maLopHocPhan: dk.ma_lop_hoc_phan,
        diemChuyenCan: dk.chuyen_can
          ? parseFloat(dk.chuyen_can.diem_trung_binh).toFixed(2)
          : null,
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
    diemTrungBinh: dk.chuyen_can?.diem_trung_binh
      ? parseFloat(dk.chuyen_can.diem_trung_binh).toFixed(2)
      : null,

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

const mapStudents = (students) => {
  return students.map((student) => {
    const dangKy = student.dang_ky.map((dk) => ({
      id: dk.id,
      maLopHocPhan: dk.ma_lop_hoc_phan,
      diemChuyenCan: dk.chuyen_can
        ? parseFloat(dk.chuyen_can.diem_trung_binh).toFixed(2)
        : null,
    }));

    const diemArr = dangKy
      .map((dk) => parseFloat(dk.diemChuyenCan))
      .filter((d) => !isNaN(d));

    const diemTrungBinhChuyenCan =
      diemArr.length > 0
        ? (diemArr.reduce((a, b) => a + b) / diemArr.length).toFixed(2)
        : null;

    return {
      maSinhVien: student.ma_sinh_vien,
      ten: student.ten,
      lopChuyenNganh: student.lop_chuyen_nganh,
      dienThoai1: student.dien_thoai1,
      dienThoai2: student.dien_thoai2,
      email1: student.email1,
      dangKy,
      diemTrungBinhChuyenCan,
    };
  });
};

module.exports = {
  mapClasses,
  mapClassInfo,
  mapSessions,
  //Student
  mapStudentClasses,
  mapStudents,
  //Attendance
  mapAttendanceByClass,
};
