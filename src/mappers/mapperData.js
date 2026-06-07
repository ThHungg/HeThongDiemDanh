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
      email1: dk.sinh_vien?.email1,
      email2: dk.sinh_vien?.email2,
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
  return {
    maSinhVien: studentData.ma_sinh_vien,
    ten: studentData.ten,
    // lopChuyenNganh: studentData.lop_chuyen_nganh,
    // dienThoai1: studentData.dien_thoai1,
    // dienThoai2: studentData.dien_thoai2,
    // email1: studentData.email1,
    // email2: studentData.email2,
    lopChuyenNganh: studentData.lop_chuyen_nganh,
    dienThoai1: studentData.dien_thoai1,
    dienThoai2: studentData.dien_thoai2,
    email1: studentData.email1,
    email2: studentData.email2,
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
    id: dk.id,
    maSinhVien: dk.sinh_vien?.ma_sinh_vien,
    email1: dk.sinh_vien?.email1,
    email2: dk.sinh_vien?.email2,
    ten: dk.sinh_vien?.ten,
    lopChuyenNganh: dk.sinh_vien?.lop_chuyen_nganh,
    maLopHocPhan: dk.ma_lop_hoc_phan,
    diemTrungBinh: dk.chuyen_can?.diem_trung_binh
      ? parseFloat(dk.chuyen_can.diem_trung_binh).toFixed(2)
      : null,

    lichSuDiemDanh: dk.sinh_vien?.lich_su_diem_danh
      ? dk.sinh_vien.lich_su_diem_danh
          .sort((a, b) => a.buoi_hoc_id - b.buoi_hoc_id)
          .map((diem) => ({
            id: diem.id,
            buoiHocId: diem.buoi_hoc_id,
            diemSo: diem.diem_so !== null ? parseFloat(diem.diem_so) : null,
            thoiGianDiemDanh: diem.thoi_gian_diem_danh,
            ghiChu: diem.ghi_chu,
            maGiangVien: diem.ma_giang_vien,
          }))
      : [],
  }));
};

const mapStudents = (
  students,
  isFilterDate = false,
  startDate,
  endDate,
  minScore,
  maxScore,
) => {
  const result = [];

  for (let student of students) {
    const raw = student.get ? student.get({ plain: true }) : student;

    // Group lich_su_diem_danh by tkb_id
    const diemDanhByTkb = {};
    if (raw.lich_su_diem_danh) {
      for (const dd of raw.lich_su_diem_danh) {
        if (dd.buoi_hoc && dd.buoi_hoc.tkb_id) {
          const tkbId = dd.buoi_hoc.tkb_id;
          if (!diemDanhByTkb[tkbId]) diemDanhByTkb[tkbId] = [];
          diemDanhByTkb[tkbId].push(dd);
        }
      }
    }

    const dangKy = (raw.dang_ky || []).map((dk) => {
      let diemHienTai = null;

      if (isFilterDate) {
        const tkbId = dk.thong_tin_tkb?.id;
        const list = diemDanhByTkb[tkbId] || [];
        if (list.length > 0) {
          const tong = list.reduce(
            (sum, dd) => sum + parseFloat(dd.diem_so !== null ? dd.diem_so : 0),
            0,
          );
          diemHienTai = (tong / list.length).toFixed(2);
        }
      } else {
        diemHienTai = dk.chuyen_can?.diem_trung_binh || null;
      }

      return {
        id: dk.id,
        maLopHocPhan: dk.ma_lop_hoc_phan,
        tenHocPhan: dk.thong_tin_tkb?.hoc_phan?.ten_hoc_phan,
        diemChuyenCan: diemHienTai,
      };
    });

    const diemArr = dangKy
      .map((dk) => parseFloat(dk.diemChuyenCan))
      .filter((d) => !isNaN(d));

    const diemTrungBinhChuyenCan =
      diemArr.length > 0
        ? (diemArr.reduce((a, b) => a + b) / diemArr.length).toFixed(2)
        : null;

    let isValid = true;

    const hasMinScore = minScore !== undefined && minScore !== "";
    const hasMaxScore = maxScore !== undefined && maxScore !== "";
    const isFilterScore = hasMinScore || hasMaxScore;

    if (isFilterDate || isFilterScore) {
      if (diemTrungBinhChuyenCan === null) {
        isValid = false; // Filter out if no score calculated
      } else {
        const avg = parseFloat(diemTrungBinhChuyenCan);
        if (hasMinScore && avg < parseFloat(minScore)) isValid = false;
        if (hasMaxScore && avg > parseFloat(maxScore)) isValid = false;
      }
    }

    if (isValid) {
      result.push({
        maSinhVien: raw.ma_sinh_vien,
        ten: raw.ten,
        lopChuyenNganh: raw.lop_chuyen_nganh,
        dienThoai1: raw.dien_thoai1,
        dienThoai2: raw.dien_thoai2,
        email1: raw.email1,
        email2: raw.email2,
        dangKy,
        diemTrungBinhChuyenCan,
      });
    }
  }

  return result;
};

const mapAttendanceByStudent = (attendanceData) => {
  const groupedByClass = {};

  attendanceData.forEach((record) => {
    const tkbId = record.buoi_hoc?.thoi_khoa_bieu?.id;
    if (!groupedByClass[tkbId]) {
      groupedByClass[tkbId] = [];
    }
    groupedByClass[tkbId].push(record);
  });

  const result = Object.entries(groupedByClass).map(([tkbId, records]) => {
    return {
      lopHocPhanId: tkbId,
      buoiHoc: records.map((record) => ({
        id: record.id,
        buoiHocId: record.buoi_hoc_id,
        ngayHoc: record.buoi_hoc?.ngay_hoc,
        diemSo: record.diem_so !== null ? parseFloat(record.diem_so) : null,
        thoiGianDiemDanh: record.thoi_gian_diem_danh,
        thoiGianChiTiet: record.buoi_hoc?.chi_tiet_tiet_hoc
          ? {
              id: record.buoi_hoc.chi_tiet_tiet_hoc.id,
              batDau: record.buoi_hoc.chi_tiet_tiet_hoc.bat_dau,
              ketThuc: record.buoi_hoc.chi_tiet_tiet_hoc.ket_thuc,
              thu: record.buoi_hoc.chi_tiet_tiet_hoc.thu,
              phong: record.buoi_hoc.chi_tiet_tiet_hoc.phong,
            }
          : null,
        // ghiChu: record.ghi_chu,
        // maGiangVien: record.ma_giang_vien,
      })),
      tongDiem: records.reduce((sum, r) => {
        return sum + (r.diem_so !== null ? parseFloat(r.diem_so) : 0);
      }, 0),
      soLanCoMat: records.filter((r) => r.diem_so !== null).length,
      soLanVang: records.filter((r) => r.diem_so === null).length,
      diemTrungBinh:
        records.length > 0
          ? (
              records.reduce((sum, r) => {
                return sum + (r.diem_so !== null ? parseFloat(r.diem_so) : 0);
              }, 0) / records.length
            ).toFixed(2)
          : null,
    };
  });

  return result.length === 1 ? result[0] : result;
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
  mapAttendanceByStudent,
};
