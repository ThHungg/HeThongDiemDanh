"use client";
import AttendanceClassModal from "@/components/Common/Modals/AttendanceClassModal";
import Pagination from "@/components/Common/Pagination";
import { memo, useState } from "react";
import * as classService from "@/services/classService";
import { useQuery } from "@tanstack/react-query";
import { formatClassCode } from "@/utils/formatClassCode";
import { useSemesterStore } from "@/store/useSemesterStore";

const ClassesTable = () => {
  const selectedSemester = useSemesterStore((state) => state.selectedSemester);
  const [isSelectedClasscode, setIsSelectedClasscode] = useState("242IT38002");
  const [openAttendanceClass, setOpenAttendanceClass] = useState(false);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const ITEMS_PER_PAGE = 10;

  const getAllClasses = async () => {
    const res = await classService.getAllClassesService({
      page,
      limit: ITEMS_PER_PAGE,
      searchText,
      lecturerId: selectedLecturer || undefined,
      semester: selectedSemester,
    });
    return res;
  };
  const getAllLecturer = async () => {
    const res = await classService.getAllLecturerService();
    return res;
  };

  const { data: allLecturers } = useQuery({
    queryKey: ["all-lecturers"],
    queryFn: getAllLecturer,
  });
  const {
    data: allClasses,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "all-classes",
      page,
      searchText,
      selectedLecturer,
      selectedSemester,
    ],
    queryFn: () => getAllClasses(),
  });

  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      {/* Filter */}
      <div className="flex justify-between items-center mr-4 py-2">
        <div className="flex items-center justify-center py-2 w-full max-w-[300px] px-4">
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
              placeholder="Tìm kiếm lớp học, giảng viên, môn học"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              className="bg-white text-[12px] rounded-lg py-1.5 pl-10 pr-4 w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>
        </div>
        <div className="text-[13px] text-[#475569] flex items-center gap-2">
          <span className="">Bộ lọc: </span>
          <select
            value={selectedLecturer}
            onChange={(e) => {
              setSelectedLecturer(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-1 focus:ring-[#8B0000] cursor-pointer"
          >
            <option value="">Tất cả giảng viên</option>
            {Array.isArray(allLecturers?.data)
              ? allLecturers.data.map((lecturer: any) => (
                  <option
                    key={lecturer.id}
                    value={lecturer.ma_giang_vien || lecturer.id}
                  >
                    {lecturer.ten}
                  </option>
                ))
              : null}
          </select>
        </div>
      </div>
      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-[#F8FAFC] text-[14px] text-[#64748B] border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Mã lớp</th>
            <th className="text-left px-4 py-3 font-semibold">Tên môn học</th>
            <th className="text-left px-4 py-3 font-semibold">Giảng viên</th>
            <th className="text-left px-4 py-3 font-semibold">Sĩ số</th>
            <th className="text-left px-4 py-3 font-semibold">Chuyên cần tb</th>
            <th className="text-left px-4 py-3 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white text-[14px] text-[#475569]">
          {allClasses?.data?.map((classItem: any) => (
            <tr
              key={classItem.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="text-left px-4 py-2 font-bold text-[#111827]">
                {formatClassCode(classItem.ma_lop_hoc_phan, classItem.ten_lop)}
              </td>

              <td className="text-left px-4 py-2 font-semibold ">
                <p> {classItem?.hoc_phan?.ten_hoc_phan}</p>
                {classItem.thoi_khoa_bieu_chi_tiet && (
                  <p className="text-[12px] text-gray-500 font-normal mt-0.5">
                    {classItem.thoi_khoa_bieu_chi_tiet?.map(
                      (schedule: any, index: number) => (
                        <span
                          key={`${schedule.thu}-${schedule.bat_dau}-${schedule.ket_thuc}`}
                        >
                          Thứ {schedule.thu}, Tiết {schedule.bat_dau}-
                          {schedule.ket_thuc}
                          {index !==
                            classItem.thoi_khoa_bieu_chi_tiet.length - 1 &&
                            " / "}
                        </span>
                      ),
                    )}
                  </p>
                )}
              </td>

              <td className="text-left px-4 py-2 font-semibold text-gray-600">
                {classItem.giang_vien?.ten}
              </td>

              <td className="text-left px-4 py-2 font-semibold text-gray-600">
                {classItem?.sldk} / {classItem?.suc_chua}
              </td>

              <td className="text-left px-4 py-2 font-bold space-y-1 whitespace-nowrap">
                {classItem.attendanceRate >= 9 ? (
                  <span className="text-green-600">1</span>
                ) : classItem.attendanceRate >= 7 ? (
                  <span className="text-yellow-600">2</span>
                ) : (
                  <span className="text-red-600">3</span>
                )}
              </td>

              <td className="text-left px-4 py-2">
                <button
                  onClick={() => {
                    setOpenAttendanceClass(true);
                    setIsSelectedClasscode(classItem?.ma_lop_hoc_phan);
                  }}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] font-semibold hover:bg-gray-100 transition-colors"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        totalPages={allClasses?.pagination?.totalPages || 1}
        totalItems={allClasses?.pagination?.total || 0}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={(newPage) => setPage(newPage)}
      />
      {openAttendanceClass && (
        <AttendanceClassModal
          isSelectedClasscode={isSelectedClasscode}
          onClose={() => setOpenAttendanceClass(false)}
        />
      )}
    </div>
  );
};

export default memo(ClassesTable);
