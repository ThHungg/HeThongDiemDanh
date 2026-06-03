"use client";
import { useQuery } from "@tanstack/react-query";
import { memo, useState, useMemo } from "react";
import * as classService from "@/services/classService";
import * as attendanceService from "@/services/attendanceService";
import getScoreColor from "@/utils/getScoreColor";
import { formatDate } from "@/utils/formatDatt";
import StudentDetailModal from "@/components/Common/Modals/StudentDetailModal";
import SendEmailModal from "../SendEmailModal";
import { formatClassCode } from "@/utils/formatClassCode";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import Loading from "../../Loading";

interface ListStudent {
  classCode: string;
  listStudents?: {
    id: number;
    maSinhVien: string;
    ten: string;
    lopChuyenNganh: string;
    diemChuyenCan: number | null;
  }[];
  classSession: {
    ngayHoc: string;
    chiTietTietHoc: {
      tiet: string;
      thu: string;
    };
  }[];
}

interface ClassData {
  id: number;
  ma_lop_hoc_phan: string;
  ten_lop: string;
  sldk: number;
  suc_chua: number;
  giang_vien: {
    id: number;
    ten: string;
    ma_giang_vien: string;
  };
  hoc_phan: {
    ten_hoc_phan: string;
    ma_hoc_phan: string;
  };
  thoi_khoa_bieu_chi_tiet: Array<any>;
}

const AttendanceClassModal = ({
  onClose,
  classData,
}: {
  onClose: () => void;
  classData: ClassData;
}) => {
  const [openStudentDetail, setOpenStudentDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openDetailScore, setOpenDetailScore] = useState(false);
  const [selectedStudentScores, setSelectedStudentScores] = useState<any>(null);
  const [isOpenSendEmailModal, setIsOpenSendEmailModal] = useState(false);
  const [detailStudent, setDetailStudent] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const getAttendance = async (classCode: string) => {
    const res = await attendanceService.getAttendanceByClassService(classCode);
    return res;
  };

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["attendance", classData.ma_lop_hoc_phan],
    queryFn: () => getAttendance(classData.ma_lop_hoc_phan),
  });

  const getDetailClass = async (classCode: string) => {
    const res = await classService.getDetailClassByLecturerService(classCode);
    return res;
  };

  const { data: detailClass } = useQuery({
    queryKey: ["lecturer-classes", classData.ma_lop_hoc_phan],
    queryFn: () => getDetailClass(classData.ma_lop_hoc_phan),
  });

  const classSession = detailClass?.data?.buoi_hoc || [];
  const attendanceList = attendanceData?.data?.attendance;

  // Filter attendance data based on search value
  const filteredAttendanceData = useMemo(() => {
    if (!attendanceList || !searchValue.trim()) {
      return attendanceList || [];
    }

    const lowerSearchValue = searchValue.toLowerCase().trim();
    return attendanceList.filter((student: any) => {
      const maSinhVien = (student.maSinhVien || "").toLowerCase();
      const ten = (student.ten || "").toLowerCase();
      const lopChuyenNganh = (student.lopChuyenNganh || "").toLowerCase();

      return (
        maSinhVien.includes(lowerSearchValue) ||
        ten.includes(lowerSearchValue) ||
        lopChuyenNganh.includes(lowerSearchValue)
      );
    });
  }, [attendanceList, searchValue]);

  const handleViewScoreDetail = (student: any) => {
    setSelectedStudentScores(student);
    setOpenDetailScore(true);
  };

  const exportAttendance = useMutationHooks((data: { classCode: string }) =>
    attendanceService.exportAttendanceByClassService(data.classCode),
  );

  const handleExport = async (data: { classCode: string }) => {
    exportAttendance.mutate(data, {
      onSuccess: async (res: any) => {
        console.log(res);
        if (res.data && res.data.fileName) {
          await attendanceService.downloadAttendanceTemplateService(
            res.data.fileName,
          );
        }
      },
    });
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
        <div className="max-w-[1200px] w-full bg-white rounded-lg overflow-auto px-4 max-h-screen h-3/4">
          {/* Header */}
          <div className="px-[24px] mb-2 flex justify-between sticky top-0 bg-white z-50 py-4 border-b border-gray-200">
            <div className="">
              <p className="font-semibold w-fit px-2 py-1 rounded-lg text-white text-[11px] bg-[#8B0000]">
                Thông tin lớp học
              </p>

              <div className="flex gap-2">
                <h4 className="!font-bold text-[#8B0000]">
                  {classData.hoc_phan.ten_hoc_phan}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[12px] flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="text-[#8B0000]"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M7 12h3v4H7z" />
                      <path d="M10 6H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-6" />
                      <path d="M10 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm4 12h2m-2-4h4" />
                    </g>
                  </svg>
                  Mã lớp:{" "}
                  <span>
                    {formatClassCode(
                      classData.ma_lop_hoc_phan,
                      classData.ten_lop,
                    )}
                  </span>
                </p>
                <p className="text-[12px] flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="text-[#8B0000]"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0m4.5 13c-.475-9.333-14.525-9.333-15 0"
                    />
                  </svg>
                  Giảng viên: <span>{classData.giang_vien.ten}</span>
                </p>
              </div>
            </div>
            <button onClick={() => onClose()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className=""
              >
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
          </div>
          {/* Body */}
          <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
            {/* Filter */}
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center justify-between w-full px-4">
                <div className="relative w-full max-w-md max-w-75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <path
                      fill="currentColor"
                      d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.398 0-4.064-1.666Q3.808 11.898 3.808 9.5t1.666-4.064t4.064-1.667t4.065 1.667T15.269 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo khoa, lớp, hoặc sinh viên"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="bg-white text-[12px] rounded-lg py-1.5 pl-10 pr-4 w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  />
                </div>
                <button
                  onClick={() =>
                    handleExport({ classCode: classData.ma_lop_hoc_phan })
                  }
                  className="px-4 py-2 bg-white border-gray-300 border rounded-lg text-[14px] font-semibold items-center flex gap-1 hover:scale-105 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 4v12.25L17.25 11l.75.66l-6.5 6.5l-6.5-6.5l.75-.66L11 16.25V4zM3 19h1v2h15v-2h1v3H3z"
                    />
                  </svg>
                  <span className="text-[12px]">Xuất báo cáo</span>
                </button>
              </div>
              {/* <div className="text-[13px] text-[#475569] flex items-center gap-2">
                <span className="">Lớp: </span>
                <select
                  name=""
                  id=""
                  className="bg-white border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-1 focus:ring-[#8B0000] cursor-pointer"
                >
                  <option value="">Công nghệ Blockchain (243IS430.02)</option>
                  <option value="">Công nghệ Blockchain (243IS430.03)</option>
                  <option value="">Công nghệ phần mềm (243IS430.03)</option>
                  <option value="">Công nghệ Blockchain (243IS430.03)</option>
                </select>
              </div> */}
            </div>
            <div className="bg-[#F8FAFC] py-2 px-4">
              <div className="flex justify-between items-center w-3/5">
                <div className="flex gap-5 ">
                  <p className="space-x-1 font-bold">
                    <span className="px-2 py-1 bg-[#DCFCE7] text-[#166534] rounded-lg text-[12px]">
                      10
                    </span>
                    <span className="text-[12px] text-[#737373]">Có mặt</span>
                  </p>
                  <p className="space-x-1 font-bold">
                    <span className="px-2 py-1 bg-[#FEF9C3] text-[#854D0E] rounded-lg text-[12px]">
                      1-9
                    </span>
                    <span className="text-[12px] text-[#737373]">Muộn</span>
                  </p>
                  <p className="space-x-1 font-bold">
                    <span className="px-2 py-1 bg-[#F4E6E6] text-[#8B0000] rounded-lg text-[12px]">
                      0
                    </span>
                    <span className="text-[12px] text-[#737373]">Nghỉ</span>
                  </p>
                </div>
                <p className="font-semibold text-[#737373] text-center text-[12px]">
                  Xem chi tiết điểm từng buổi học
                </p>
              </div>
            </div>
            {/* Table */}
            {isLoading ? (
              <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden h-96 items-center justify-center">
                <Loading text="Đang tải dữ liệu..." />
              </div>
            ) : filteredAttendanceData?.length === 0 ? (
              <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden h-40 items-center justify-center">
                <p className="text-gray-500 text-sm">
                  Không tìm thấy sinh viên
                </p>
              </div>
            ) : (
              <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* BẢNG 1: CỐ ĐỊNH */}
                <div className="shrink-0 shadow-[4px_0_8px_rgba(0,0,0,0.05)] z-10">
                  <table className="border-collapse">
                    <thead className="border-b border-gray-200">
                      <tr className="bg-[#F8FAFC] text-[#64748B] h-13">
                        <th className="text-left px-4 py-3 font-semibold border-r border-gray-200">
                          STT
                        </th>
                        <th className="text-left px-4 py-3 font-semibold border-r border-gray-200">
                          Mã SV
                        </th>
                        <th className="text-left px-4 py-3 font-semibold border-r border-gray-200 min-w-45">
                          Họ và tên
                        </th>
                        <th className="text-left px-4 py-3 font-semibold whitespace-nowrap bg-[#F4E6E6] text-[#8B0000]">
                          Điểm TB
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAttendanceData?.map(
                        (student: any, index: number) => (
                          <tr
                            key={student.id}
                            className="h-12 hover:bg-gray-50 transition-colors divide-x divide-gray-200"
                          >
                            <td className="px-4 py-3 text-[#8B0000] font-semibold border-r border-gray-200">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 font-semibold border-r border-gray-200">
                              {student.maSinhVien}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-bold border-r border-gray-200">
                              <div className="flex items-center gap-2">
                                <button
                                  className="cursor-pointer hover:underline text-gray-800"
                                  onClick={() => {
                                    setSelectedStudent(student.maSinhVien);
                                    setOpenStudentDetail(true);
                                  }}
                                >
                                  {student.ten}
                                </button>

                                <button
                                  onClick={() => {
                                    setDetailStudent(student);
                                    setIsOpenSendEmailModal(true);
                                  }}
                                  className="relative group flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 48 48"
                                    className="cursor-pointer text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <g
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="4"
                                    >
                                      <path d="M44 24V9H24H4V24V39H24" />
                                      <path d="M44 34L30 34" />
                                      <path d="M39 29L44 34L39 39" />
                                      <path d="M4 9L24 24L44 9" />
                                    </g>
                                  </svg>

                                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                                    <div className="bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                                      Gửi email cảnh báo tới sinh viên
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center bg-[#F4E6E6] text-[#8B0000] font-semibold">
                              {student?.diemTrungBinh || "-"}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                {/* BẢNG 2: CÓ THỂ CUỘN NGANG */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="border-b border-gray-200">
                      <tr className="bg-[#F8FAFC] text-[#64748B] h-13 divide-x divide-gray-200">
                        {classSession?.map((item: any, index: number) => (
                          <th
                            key={index}
                            className="text-center px-2 py-3 font-semibold text-[11px] min-w-25 border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="leading-tight">
                              <div className="font-bold">
                                {formatDate(item.ngayHoc)} (T
                                {item.chiTietTietHoc.thu})
                              </div>
                              <div className="text-[9px] opacity-70">
                                Tiết {item.chiTietTietHoc.tiet}
                              </div>
                            </div>
                          </th>
                        ))}
                        <th className="text-left px-4 py-3 font-semibold min-w-37.5">
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAttendanceData?.map((attendance: any) => {
                        return (
                          <tr
                            key={attendance.id}
                            className="h-12 hover:bg-gray-50 transition-colors divide-x divide-gray-200"
                          >
                            {classSession?.map(
                              (session: any, sessionIndex: number) => {
                                // Tìm score dựa trên buoiHocId match với session
                                const score = attendance.lichSuDiemDanh?.find(
                                  (s: any) => s.buoiHocId === session.id,
                                );

                                return (
                                  <td
                                    key={`${session.id}-${sessionIndex}`}
                                    onClick={() =>
                                      handleViewScoreDetail(attendance)
                                    }
                                    className={`p-3 border-r border-gray-200 text-center font-semibold cursor-pointer hover:bg-opacity-80 transition-colors ${getScoreColor(score?.diemSo)}`}
                                  >
                                    {score?.diemSo ?? "-"}
                                  </td>
                                );
                              },
                            )}
                            <td className="px-4 py-2 min-w-37.5 border-r border-gray-200">
                              <p className="text-[12px] text-gray-700 truncate">
                                {attendance.lichSuDiemDanh?.[0]?.ghiChu || "-"}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          {/* Modal Chi tiết điểm theo ngày */}
          {openDetailScore && selectedStudentScores && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-[#8B0000] to-[#5a0000] text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Chi tiết điểm danh</h2>
                    <p className="text-sm opacity-90 mt-1">
                      {selectedStudentScores.maSinhVien} -{" "}
                      {selectedStudentScores.ten}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenDetailScore(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        Điểm trung bình
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedStudentScores?.diemTrungBinh || "-"}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        Tổng buổi học
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedStudentScores.lichSuDiemDanh?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Score Details Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Ngày học
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Tiết
                          </th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            Điểm
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Ghi chú
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {classSession?.map((session: any, index: number) => {
                          const score =
                            selectedStudentScores.lichSuDiemDanh?.find(
                              (s: any) => s.buoiHocId === session.id,
                            );

                          return (
                            <tr
                              key={`${session.id}-${index}`}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm">
                                {formatDate(session.ngayHoc)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {`Tiết ${session.chiTietTietHoc.tiet} (Thứ ${session.chiTietTietHoc.thu})`}
                              </td>
                              <td
                                className={`px-4 py-3 text-center font-bold ${getScoreColor(score?.diemSo)}`}
                              >
                                {score?.diemSo ?? "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {score?.ghiChu || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setOpenDetailScore(false)}
                    className="px-6 py-2 bg-[#8B0000] text-white font-semibold rounded-lg hover:bg-[#8B0000]/80 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
          {openStudentDetail && (
            <StudentDetailModal
              onClose={() => setOpenStudentDetail(false)}
              studentId={selectedStudent}
            />
          )}
        </div>
      </div>
      {isOpenSendEmailModal && (
        <SendEmailModal
          onClose={() => setIsOpenSendEmailModal(false)}
          studentData={detailStudent}
        />
      )}
    </>
  );
};

export default memo(AttendanceClassModal);
