"use client";
import AttendanceDetailModal from "@/components/Common/Modals/AttendanceDetailModal";
import SendEmailModal from "@/components/Common/Modals/SendEmailModal";
import Pagination from "@/components/Common/Pagination";
import { memo, useState, useMemo, useEffect } from "react";
import * as studentService from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";
import isStudentRole from "@/utils/isStudent";
import Loading from "@/components/Common/Loading";

interface FilterOptions {
  startDate?: string;
  endDate?: string;
  minScore?: string;
  maxScore?: string;
}

interface StudentsTableProps {
  searchValue?: string;
  filters?: FilterOptions;
}

const StudentsTable = ({
  searchValue = "",
  filters = {},
}: StudentsTableProps) => {
  const [isSelectedStudentId, setIsSelectedStudentId] = useState("");
  const [openAttendanceDetail, setOpenAttendanceDetail] = useState(false);
  const [openBulkEmailModal, setOpenBulkEmailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [avgChuyenCan, setAvgChuyenCan] = useState<number | null>(null);
  const [selectStudent, setSelectStudent] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(),
  );
  const [studentDataCache, setStudentDataCache] = useState<any>({});

  const isStudent = useMemo(() => isStudentRole(), []);

  const getAllStudents = async () => {
    const res = await studentService.getAllStudentsService(
      page,
      limit,
      searchValue,
      filters.startDate,
      filters.endDate,
      filters.minScore,
      filters.maxScore,
    );
    return res;
  };

  const {
    data: allStudents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-students", page, limit, searchValue, filters],
    queryFn: () => getAllStudents(),
  });

  const students = allStudents?.data || [];

  const pagination = allStudents?.pagination || {};

  // Cache student data from all pages (including emails)
  useEffect(() => {
    setStudentDataCache((prev) => {
      const updated = { ...prev };
      students.forEach((s: any) => {
        updated[s.maSinhVien] = {
          msv: s.maSinhVien,
          name: s.ten,
          email1: s.email1 || "",
          email2: s.email2 || "",
        };
      });
      return updated;
    });
  }, [students]);

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSelectStudent = (msv: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(msv)) {
      newSelected.delete(msv);
    } else {
      newSelected.add(msv);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === students.length && students.length > 0) {
      setSelectedStudents(new Set());
    } else {
      const allMsvs = students.map((s: any) => s.maSinhVien);
      setSelectedStudents(new Set(allMsvs));
    }
  };

  const selectedStudentList = Array.from(selectedStudents)
    .map((msv) => {
      const cached = studentDataCache[msv] || {
        msv,
        name: "",
        email1: "",
        email2: "",
      };
      const fullStudent = students.find((s: any) => s.maSinhVien === msv);
      return {
        msv: cached.msv,
        name: cached.name,
        email1: fullStudent?.email1 || cached.email1,
        email2: fullStudent?.email2 || cached.email2,
      };
    })
    .filter((s) => s.msv);

  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      {/* Bulk action bar */}
      {selectedStudents.size > 0 && (
        <div className="bg-[#8B0000]/10 px-4 py-3 border-b border-[#8B0000]/20 flex items-center justify-between">
          <p className="text-[14px] font-semibold text-[#8B0000]">
            Đã chọn {selectedStudents.size} sinh viên
          </p>
          <button
            onClick={() => setOpenBulkEmailModal(true)}
            className="px-4 py-2 bg-[#8B0000] text-white text-[13px] font-semibold rounded-lg hover:bg-[#700000] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Gửi Email
          </button>
        </div>
      )}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 rounded-t-lg">
            <Loading text="Đang tải dữ liệu..." />
          </div>
        )}
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-[#F8FAFC] text-[14px] text-[#64748B] border-b border-gray-200">
            <tr>
              <th className="text-center px-4 py-3 font-semibold w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedStudents.size === students.length &&
                    students.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer accent-[#8B0000]"
                />
              </th>
              <th className="text-left px-4 py-3 font-semibold">MSV</th>
              <th className="text-left px-4 py-3 font-semibold">Họ và tên</th>
              <th className="text-left px-4 py-3 font-semibold">Lớp</th>
              <th className="text-left px-4 py-3 font-semibold">
                Điểm trung bình
              </th>
              <th className="text-left px-4 py-3 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white text-[14px] text-[#475569]">
            {students.length > 0 ? (
              students.map((student: any) => (
                <tr
                  key={student.maSinhVien}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedStudents.has(student.maSinhVien)
                      ? "bg-[#8B0000]/5"
                      : ""
                  }`}
                >
                  <td className="text-center px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.maSinhVien)}
                      onChange={() => handleSelectStudent(student.maSinhVien)}
                      className="w-4 h-4 cursor-pointer accent-[#8B0000]"
                    />
                  </td>
                  {/* MSV */}
                  <td className="text-left px-4 py-2 font-bold text-[#111827]">
                    {student.maSinhVien}
                  </td>

                  {/* Họ và tên + Số điện thoại */}
                  <td className="text-left px-4 py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
                        alt={student.ten || "N/A"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111827]">
                          {student.ten || "-"}
                        </span>
                        {student.dienThoai1 && (
                          <span className="text-[12px] text-gray-500 font-normal mt-0.5">
                            {student.dienThoai1}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Lớp */}
                  <td className="text-left px-4 py-2 font-semibold text-gray-600">
                    {student.lopChuyenNganh || "-"}
                  </td>

                  {/* Điểm trung bình */}
                  <td className="text-left px-4 py-2 font-bold">
                    {student.diemTrungBinhChuyenCan ? (
                      <span className="text-[#16A34A]">
                        {parseFloat(student.diemTrungBinhChuyenCan).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Hành động */}
                  <td className="text-left px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setOpenAttendanceDetail(true);
                        setIsSelectedStudentId(student.maSinhVien);
                        setAvgChuyenCan(student.diemTrungBinhChuyenCan);
                        setSelectStudent(student);
                      }}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Chi tiết
                    </button>
                    {/* <button
                      onClick={() => {
                        setSelectedStudents(new Set([student.maSinhVien]));
                        setOpenBulkEmailModal(true);
                      }}
                      className="px-3 py-1.5 border bg-[#8B0000] rounded-lg text-[13px] font-semibold text-white hover:bg-[#6B0000] transition-colors"
                    >
                      Email
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={pagination.currentPage || 1}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.totalRecords || 0}
        itemsPerPage={pagination.limit || 10}
        onPageChange={(page) => setPage(page)}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      {openAttendanceDetail && (
        <AttendanceDetailModal
          isStudent={isStudent}
          onClose={() => setOpenAttendanceDetail(false)}
          studentId={isSelectedStudentId}
          avgChuyenCan={avgChuyenCan}
          studentInfo={selectStudent}
        />
      )}
      {openBulkEmailModal && (
        <SendEmailModal
          onClose={() => setOpenBulkEmailModal(false)}
          onSuccess={() => setSelectedStudents(new Set())}
          bulkMode={selectedStudentList.length > 0}
          studentList={selectedStudentList}
          classCode={selectStudent?.maLopHocPhan || ""}
          studentData={
            selectedStudentList.length === 1
              ? {
                  name: selectedStudentList[0].name,
                  msv: selectedStudentList[0].msv,
                  classCode: selectStudent?.maLopHocPhan || "",
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default memo(StudentsTable);
