"use client";
import StudentDetailModal from "@/components/Common/Modals/StudentDetailModal";
import { memo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import getScoreColor from "@/utils/getScoreColor";
import { formatDate } from "@/utils/formatDatt";
import * as attendanceService from "@/services/attendanceService";
import * as classService from "@/services/classService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { toast } from "react-toastify";
import { formatClassCode } from "@/utils/formatClassCode";
import SendEmailModal from "@/components/Common/Modals/SendEmailModal";
import Loading from "@/components/Common/Loading";

interface ListStudent {
  classCode: string;
  setSelectClassCode: (classCode: string) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  listStudents?: {
    id: number;
    maSinhVien: string;
    ten: string;
    email1: string;
    email2: string;
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

const ClassDetailListTable = ({
  listStudents,
  classSession,
  classCode,
  setSelectClassCode,
  onDirtyChange,
}: ListStudent) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openStudentDetail, setOpenStudentDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>({
    attendanceData: [],
  });
  const [noteUpdates, setNoteUpdates] = useState<{ [key: number]: string }>({});
  const [resetKey, setResetKey] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isOpenSendEmailModal, setIsOpenSendEmailModal] = useState(false);
  const [detailStudent, setDetailStudent] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const isToday = (dateString: string) => {
    const sessionDate = new Date(dateString);
    const today = new Date();
    // const today = new Date("2026-06-08");
    return (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const todayColumn = scrollContainerRef.current.querySelector(
        'th[data-is-today="true"]',
      ) as HTMLElement;
      if (todayColumn) {
        const scrollLeft =
          todayColumn.offsetLeft - scrollContainerRef.current.clientWidth / 2;
        scrollContainerRef.current.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }
    }
  }, [classSession]);

  const hasUnsavedChanges =
    attendance.attendanceData.length > 0 || Object.keys(noteUpdates).length > 0;

  useEffect(() => {
    onDirtyChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onDirtyChange]);

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

  const filteredAttendanceData =
    attendanceData?.data?.attendance?.filter((student: any) => {
      const searchNormalized = removeAccents(searchText);
      return (
        removeAccents(student.ten || "").includes(searchNormalized) ||
        removeAccents(student.maSinhVien || "").includes(searchNormalized)
      );
    }) || [];

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
      attendanceData?.data?.attendance?.forEach((att: any) => {
        if (noteUpdates[att.id]) {
          att.lichSuDiemDanh?.forEach((score: any) => {
            updatedRecords.push({
              id: score.id,
              diem_so: score.diemSo,
              ghi_chu: noteUpdates[att.id],
              thoi_gian_diem_danh: new Date().toISOString(),
            });
          });
        }
      });
    }

    if (updatedRecords.length === 0) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }

    updateAttendance.mutate(
      { attendanceData: updatedRecords },
      {
        onSuccess: (res: any) => {
          queryClient.invalidateQueries({
            queryKey: ["attendance", classCode],
          });
          refetch();
          toast.success(res.message || "Cập nhật điểm danh thành công!");
          setAttendance({ attendanceData: [] });
          setNoteUpdates({});
        },
        onError: (error: any) => {
          setResetKey((prev) => prev + 1);
          setAttendance({ attendanceData: [] });
          setNoteUpdates({});
        },
      },
    );
  };

  const getClassesByLecturerService = async () => {
    const res = await classService.getClassesByLecturerService();
    return res;
  };

  const { data: classes } = useQuery({
    queryKey: ["lecturer-classes"],
    queryFn: getClassesByLecturerService,
  });

  console.log(filteredAttendanceData);
  return (
    <div className=" overflow-y-autorounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      {/* Filter */}
      <div className="flex justify-between items-center p-4 sticky top-[-24px] z-50">
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
              placeholder="Tìm kiếm theo tên hoặc mã sinh viên"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white text-[12px] rounded-lg py-1.5 pl-10 pr-4 w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-[13px] text-[#475569] flex items-center gap-2">
            <span className="">Lớp: </span>
            <select
              value={classCode}
              onChange={(e) => {
                const newClassCode = e.target.value;
                router.push(`/lecturer/classes/${newClassCode}`);
              }}
              className="bg-white border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-1 focus:ring-[#8B0000] cursor-pointer"
            >
              {classes?.data?.map((item: any) => (
                <option key={item.maLopHocPhan} value={item.maLopHocPhan}>
                  {item.hocPhan?.tenHocPhan || "Không tên"} (
                  {formatClassCode(item.maLopHocPhan, item.tenLop || "")})
                </option>
              ))}
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

      <div className="bg-[#F8FAFC] py-2 px-4 relative">
        {/* {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 rounded-t-lg">
            <Loading text="Đang tải dữ liệu..." />
          </div>
        )} */}
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
      <div
        key={resetKey}
        className="flex bg-white rounded-xl border border-gray-200 overflow-hidden relative"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 rounded-lg">
            <Loading text="Đang tải dữ..." />
          </div>
        )}
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
              {filteredAttendanceData && filteredAttendanceData.length > 0 ? (
                filteredAttendanceData?.map((student: any, index: number) => (
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
                          <button
                            onClick={() => {
                              setDetailStudent({
                                msv: student.maSinhVien,
                                name: student.ten,
                                classCode: student.maLopHocPhan,
                                email1: student.email1,
                                email2: student.email2,
                              });
                              setIsOpenSendEmailModal(true);
                            }}
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
                          </button>

                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                            <div className="bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                              Gửi email cảnh báo tới sinh viên
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center bg-[#F4E6E6] text-[#8B0000] font-semibold">
                      {student?.diemTrungBinh !== undefined &&
                      student?.diemTrungBinh !== null
                        ? student.diemTrungBinh
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-5 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-gray-300"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg> */}
                      <p className="text-[14px] font-semibold text-gray-600">
                        {searchText
                          ? "Không tìm thấy sinh viên phù hợp"
                          : "Không có dữ liệu"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BẢNG 2: CÓ THỂ CUỘN NGANG */}
        <div ref={scrollContainerRef} className="flex-1 overflow-x-auto ">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="bg-[#F8FAFC] text-[#64748B] h-[52px] divide-x divide-gray-200">
                {classSession?.map((item, index) => (
                  <th
                    key={index}
                    data-is-today={isToday(item.ngayHoc)}
                    className={`text-center px-2 py-3 font-semibold text-[11px] min-w-[100px] border-r border-gray-200 ${
                      isToday(item.ngayHoc)
                        ? "bg-gray-200 text-gray-900 font-bold"
                        : ""
                    }`}
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
              {filteredAttendanceData && filteredAttendanceData.length > 0 ? (
                filteredAttendanceData?.map((attendance: any) => (
                  <tr
                    key={attendance.id}
                    className="h-[48px] hover:bg-gray-50 transition-colors divide-x divide-gray-200"
                  >
                    {Array(classSession?.length || 0)
                      .fill(null)
                      .map((_, scoreIndex) => {
                        const score = attendance.lichSuDiemDanh?.[scoreIndex];
                        const sessionDate = classSession?.[scoreIndex]?.ngayHoc;
                        const isTodayColumn = isToday(sessionDate);
                        return (
                          <td
                            key={scoreIndex}
                            className={`p-0 border-r border-gray-200 ${
                              isTodayColumn ? "bg-gray-100 border" : ""
                            } ${getScoreColor(score?.diemSo)}`}
                          >
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              data-student-id={attendance.id}
                              data-score-index={scoreIndex}
                              defaultValue={
                                score?.diemSo !== undefined &&
                                score?.diemSo !== null
                                  ? score.diemSo
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  if (score?.id) {
                                    handleUpdateStudentScore(score.id, 0);
                                  }
                                } else {
                                  const numValue = parseFloat(value);

                                  const decimalPlaces = value.includes(".")
                                    ? value.split(".")[1].length
                                    : 0;

                                  if (isNaN(numValue)) {
                                    toast.error("Vui lòng nhập số hợp lệ");
                                    e.target.value = "";
                                  } else if (numValue < 0 || numValue > 10) {
                                    toast.error("Điểm phải từ 0 đến 10");
                                    e.target.value = "";
                                  } else if (decimalPlaces > 2) {
                                    toast.error(
                                      "Điểm chỉ được phép 2 chữ số thập phân",
                                    );
                                    e.target.value = "";
                                  } else {
                                    if (score?.id) {
                                      handleUpdateStudentScore(
                                        score.id,
                                        numValue,
                                      );
                                    }
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const currentRow = (
                                    e.target as HTMLElement
                                  ).closest("tr");
                                  const nextRow =
                                    currentRow?.nextElementSibling as HTMLElement;
                                  if (nextRow) {
                                    const nextInput = nextRow.querySelector(
                                      `input[data-score-index="${scoreIndex}"]`,
                                    ) as HTMLInputElement;
                                    if (nextInput) {
                                      nextInput.focus();
                                      nextInput.select();
                                    }
                                  }
                                }
                              }}
                              placeholder="-"
                              className="w-full h-[47px] text-center font-semibold rounded transition-all outline-none focus:ring-1 focus:ring-[#8B0000] bg-transparent"
                            />
                          </td>
                        );
                      })}
                    <td className="px-4 py-1.5 min-w-[150px] border-r border-gray-200">
                      <input
                        type="text"
                        value={
                          noteUpdates[attendance.id] ??
                          attendance.lichSuDiemDanh?.[0]?.ghiChu ??
                          ""
                        }
                        onChange={(e) => {
                          setNoteUpdates((prev) => ({
                            ...prev,
                            [attendance.id]: e.target.value,
                          }));
                        }}
                        placeholder="Nhập ghi chú..."
                        className="w-full px-2 py-2 text-[12px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8B0000] bg-white"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={classSession?.length || 1 + 1}
                    className="px-4 py-5 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[14px] font-semibold text-gray-600">
                        {searchText
                          ? "Không tìm thấy sinh viên phù hợp"
                          : "Không có dữ liệu"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenSendEmailModal && (
        <SendEmailModal
          onClose={() => setIsOpenSendEmailModal(false)}
          studentData={detailStudent}
        />
      )}
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
