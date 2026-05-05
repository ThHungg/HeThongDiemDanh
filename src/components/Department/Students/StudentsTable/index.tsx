"use client";
import AttendanceDetailModal from "@/components/Common/Modals/AttendanceDetailModal";
import Pagination from "@/components/Common/Pagination";
import { memo, useState, useMemo } from "react";
import * as studentService from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";

interface StudentsTableProps {
  searchValue?: string;
}

const StudentsTable = ({ searchValue = "" }: StudentsTableProps) => {
  const [isSelectedStudentId, setIsSelectedStudentId] = useState("");
  const [openAttendanceDetail, setOpenAttendanceDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [avgChuyenCan, setAvgChuyenCan] = useState<number | null>(null);

  const getAllStudents = async () => {
    const res = await studentService.getAllStudentsService(
      page,
      limit,
      searchValue,
    );
    return res;
  };

  const {
    data: allStudents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-students", page, limit, searchValue],
    queryFn: () => getAllStudents(),
  });

  const students = allStudents?.data || [];
  const pagination = allStudents?.pagination || {};

  console.log(allStudents);
  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-[#F8FAFC] text-[14px] text-[#64748B] border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">MSV</th>
            <th className="text-left px-4 py-3 font-semibold">Họ và tên</th>
            <th className="text-left px-4 py-3 font-semibold">Lớp</th>
            <th className="text-left px-4 py-3 font-semibold">
              Điểm trung bình
            </th>
            <th className="text-left px-4 py-3 font-semibold">Tình trạng</th>
            <th className="text-left px-4 py-3 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white text-[14px] text-[#475569]">
          {students.length > 0 ? (
            students.map((student: any) => (
              <tr
                key={student.maSinhVien}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
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
                <td className="text-left px-4 py-2">
                  <button
                    onClick={() => {
                      setOpenAttendanceDetail(true);
                      setIsSelectedStudentId(student.maSinhVien);
                      setAvgChuyenCan(student.diemTrungBinhChuyenCan);
                    }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={pagination.currentPage || 1}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.totalRecords || 0}
        itemsPerPage={pagination.limit || 10}
        onPageChange={(page) => setPage(page)}
      />
      {openAttendanceDetail && (
        <AttendanceDetailModal
          isStudent={false}
          onClose={() => setOpenAttendanceDetail(false)}
          studentId={isSelectedStudentId}
          avgChuyenCan={avgChuyenCan}
        />
      )}
    </div>
  );
};

export default memo(StudentsTable);
