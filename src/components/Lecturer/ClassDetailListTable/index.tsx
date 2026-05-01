"use client";
import FilterBar from "@/components/Department/FilterBar";
import StudentDetailModal from "@/components/Common/Modals/StudentDetailModal";
import Pagination from "@/components/Common/Pagination";
import { memo, useState } from "react";
import getScoreColor from "@/utils/getScoreColor";
import { formatDate } from "@/utils/formatDatt";
import * as attendanceService from "@/services/attendanceService";
import { useQuery } from "@tanstack/react-query";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { toast } from "react-toastify";

interface Student {
  id: number;
  code: string;
  name: string;
  scores: (number | null)[];
  note: string;
}

interface ListStudent {
  classCode: string;
  listStudents?: {
    id: number;
    maSinhVien: string;
    ten: string;
    lopChuyenNganh: string;
  }[];
  classSession: {
    ngayHoc: string;
    chiTietTietHoc: {
      tiet: string;
      thu: string;
    };
  }[];
}

const ClassDetailListTable = ({
  listStudents,
  classSession,
  classCode,
}: ListStudent) => {
  const [openStudentDetail, setOpenStudentDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>({
    attendanceData: [],
  });
  const [noteUpdates, setNoteUpdates] = useState<{ [key: number]: string }>({});

  const handleUpdateStudentScore = (scoreId: number, newScore: number) => {
    const note = noteUpdates[scoreId] || "";
    setAttendance((prev: any) => {
      const existingData = prev.attendanceData;
      const existingDataIndex = existingData.findIndex(
        (item: any) => item.id === scoreId,
      );

      if (existingDataIndex > -1) {
        const updateData = [...existingData];
        updateData[existingDataIndex] = {
          id: scoreId,
          diem_so: newScore,
          ghi_chu: note,
          thoi_gian_diem_danh: new Date().toISOString(),
        };
        return { attendanceData: updateData };
      } else {
        return {
          attendanceData: [
            ...existingData,
            {
              id: scoreId,
              diem_so: newScore,
              ghi_chu: note,
              thoi_gian_diem_danh: new Date().toISOString(),
            },
          ],
        };
      }
    });
  };

  const getAttendance = async (classCode: string) => {
    const res = await attendanceService.getAttendanceByClassService(classCode);
    return res;
  };

  const {
    data: attendanceData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["attendance", classCode],
    queryFn: () => getAttendance(classCode),
  });

  const updateAttendance = useMutationHooks((data: any) =>
    attendanceService.updateAttendanceByClassService(data),
  );

  const handleSaveAttendance = async () => {
    let updatedRecords: any[] = [];

    if (attendance.attendanceData.length > 0) {
      updatedRecords = attendance.attendanceData.map((item: any) => ({
        ...item,
        ghi_chu:
          noteUpdates[item.id] !== undefined
            ? noteUpdates[item.id]
            : item.ghi_chu,
      }));
    }

    if (
      Object.keys(noteUpdates).length > 0 &&
      attendance.attendanceData.length === 0
    ) {
      // Lấy dữ liệu gốc từ API và merge với ghi chú mới
      attendanceData?.data?.attendance?.forEach((att: any) => {
        att.lichSuDiemDanh?.forEach((score: any) => {
          if (noteUpdates[score.id]) {
            updatedRecords.push({
              id: score.id,
              diem_so: score.diemSo,
              ghi_chu: noteUpdates[score.id],
              thoi_gian_diem_danh: new Date().toISOString(),
            });
          }
        });
      });
    }

    console.log("updatedRecords final", updatedRecords);

    if (updatedRecords.length === 0) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }

    updateAttendance.mutate(
      { attendanceData: updatedRecords },
      {
        onSuccess: (res: any) => {
          refetch();
          toast.success(res.message || "Cập nhật điểm danh thành công!");
          setAttendance({ attendanceData: [] });
          setNoteUpdates({});
        },
        onError: (error: any) => {
          console.error("Update error", error);
          toast.error(error?.response?.data?.message || "Cập nhật thất bại");
        },
      },
    );
  };
  console.log("Length", classSession?.length);
  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      {/* Filter */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center justify-center w-full max-w-[300px] px-4">
          <div className="relative w-full max-w-md">
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
              className="bg-white text-[12px] rounded-lg py-1.5 pl-10 pr-4 w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-[13px] text-[#475569] flex items-center gap-2">
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
          </div>
          <button
            onClick={handleSaveAttendance}
            className="text-[14px] bg-[#8B0000] text-white font-semibold px-3 py-2 rounded-xl hover:bg-[#8B0000]/80 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
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
          <p className="font-semibold text-[#737373] text-center !text-[12px]">
            {" "}
            Nhập điểm (0-10) trực tiếp vào các ô bên dưới
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* BẢNG 1: CỐ ĐỊNH */}
        <div className="flex-shrink-0 shadow-[4px_0_8px_rgba(0,0,0,0.05)] z-10">
          <table className="border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="bg-[#F8FAFC] text-[#64748B] h-[52px]">
                <th className="text-left px-4 py-3 font-semibold border-r border-gray-200">
                  STT
                </th>
                <th className="text-left px-4 py-3 font-semibold border-r border-gray-200">
                  Mã SV
                </th>
                <th className="text-left px-4 py-3 font-semibold border-r border-gray-200 min-w-[180px]">
                  Họ và tên
                </th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap bg-[#F4E6E6] text-[#8B0000]">
                  Điểm TB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listStudents?.map((student, index) => (
                <tr
                  key={student.id}
                  className="h-[48px] hover:bg-gray-50 transition-colors divide-x divide-gray-200"
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

                      <div className="relative group flex items-center">
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
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center bg-[#F4E6E6] text-[#8B0000] font-semibold">
                    10
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BẢNG 2: CÓ THỂ CUỘN NGANG */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="bg-[#F8FAFC] text-[#64748B] h-[52px] divide-x divide-gray-200">
                {classSession?.map((item, index) => (
                  <th
                    key={index}
                    className="text-center px-2 py-3 font-semibold text-[11px] min-w-[100px] border-r border-gray-200"
                  >
                    <div className="leading-tight">
                      <div className="font-bold">
                        {formatDate(item.ngayHoc)} (T{item.chiTietTietHoc.thu})
                      </div>
                      <div className="text-[9px] opacity-70">
                        Tiết {item.chiTietTietHoc.tiet}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-semibold min-w-[150px]">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData?.data?.attendance?.map((attendance: any) => (
                <tr
                  key={attendance.id}
                  className="h-[48px] hover:bg-gray-50 transition-colors divide-x divide-gray-200"
                >
                  {Array(classSession?.length || 0)
                    .fill(null)
                    .map((_, scoreIndex) => {
                      const score = attendance.lichSuDiemDanh?.[scoreIndex];
                      return (
                        <td
                          key={scoreIndex}
                          className={`p-0 border-r border-gray-200 ${getScoreColor(score?.diemSo)}`}
                        >
                          <input
                            type="number"
                            defaultValue={score?.diemSo || ""}
                            onChange={(e) =>
                              handleUpdateStudentScore(
                                score.id,
                                parseFloat(e.target.value),
                              )
                            }
                            placeholder="-"
                            className="w-full h-[47px] text-center font-semibold rounded transition-all outline-none focus:ring-1 focus:ring-[#8B0000] bg-transparent"
                          />
                        </td>
                      );
                    })}
                  <td className="px-4 py-3 min-w-[150px] border-r border-gray-200">
                    <input
                      type="text"
                      value={
                        noteUpdates[attendance.lichSuDiemDanh?.[0]?.id] ??
                        attendance.lichSuDiemDanh?.[0]?.ghiChu ??
                        ""
                      }
                      onChange={(e) => {
                        const firstScoreId = attendance.lichSuDiemDanh?.[0]?.id;
                        if (firstScoreId) {
                          setNoteUpdates((prev) => ({
                            ...prev,
                            [firstScoreId]: e.target.value,
                          }));
                        }
                      }}
                      placeholder="Nhập ghi chú..."
                      className="w-full px-2 py-2 text-[12px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8B0000] bg-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {openStudentDetail && (
        <StudentDetailModal
          onClose={() => setOpenStudentDetail(false)}
          studentId={selectedStudent}
        />
      )}
    </div>
  );
};

export default memo(ClassDetailListTable);
