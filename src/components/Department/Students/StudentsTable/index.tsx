"use client";
import AttendanceDetailModal from "@/components/Common/Modals/AttendanceDetailModal";
import Pagination from "@/components/Common/Pagination";
import { memo, useState } from "react";

const StudentsTable = () => {
  const [openAttendanceDetail, setOpenAttendanceDetail] = useState(false);
  const studentData = [
    {
      id: 1,
      studentCode: "A46588",
      fullName: "Nguyễn Văn An",
      phone: "013412313",
      className: "TT35CL07",
      attendance: {
        good: 2,
        warning: 2,
        banned: 2,
      },
      countScore: 260,
      averageScore: 9.1,
    },
    {
      id: 2,
      studentCode: "A46589",
      fullName: "Trần Thị Bình",
      phone: "013412313",
      className: "TI35CL07",
      attendance: {
        good: 2,
        warning: 2,
        banned: 2,
      },
      countScore: 160,
      averageScore: 9.1,
    },
    {
      id: 3,
      studentCode: "A46590",
      fullName: "Nguyễn Văn A",
      phone: "013412313",
      className: "TI35CL07",
      attendance: {
        good: 2,
        warning: 2,
        banned: 2,
      },
      subjectCount: 4,
      countScore: 180,
      averageScore: 9.1,
    },
    {
      id: 4,
      studentCode: "A46591",
      fullName: "Nguyễn Văn An",
      phone: "013412313",
      className: "TT35CL07",
      attendance: {
        good: 2,
        warning: 2,
        banned: 2,
      },
      subjectCount: 3,
      countScore: 290,
      averageScore: 9.1,
    },
    {
      id: 5,
      studentCode: "A46592",
      fullName: "Trần Thị Bình",
      phone: "013412313",
      className: "TI35CL07",
      attendance: {
        good: 2,
        warning: 2,
        banned: 2,
      },
      subjectCount: 5,
      countScore: 380,
      averageScore: 9.1,
    },
  ];
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
          {studentData.map((student) => (
            <tr
              key={student.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* 1. Cột Mã Sinh Viên */}
              <td className="text-left px-4 py-2 font-bold text-[#111827]">
                {student.studentCode}
              </td>

              {/* 2. Cột Họ và tên (Kết hợp Avatar, Tên và Số điện thoại) */}
              <td className="text-left px-4 py-2">
                <div className="flex items-center gap-3">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"
                    alt={student.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#111827]">
                      {student.fullName}
                    </span>
                    {student.phone && (
                      <span className="text-[12px] text-gray-500 font-normal mt-0.5">
                        {student.phone}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* 3. Cột Lớp */}
              <td className="text-left px-4 py-2 font-semibold text-gray-600">
                {student.className}
              </td>

              {/* 4. Cột Điểm trung bình */}
              <td className="text-left px-4 py-2 font-bold text-[#16A34A]">
                {student.averageScore.toString().replace(".", ",")}
                <span className="text-gray-500 text-[12px]">
                  <br />({student.countScore} / {student.subjectCount || "-"})
                </span>
              </td>

              {/* 5. Cột Chuyên cần */}
              <td className="text-left px-4 py-2 text-[13px] font-bold space-y-1 whitespace-nowrap">
                <p className="text-[#16A34A]">Tốt: {student.attendance.good}</p>
                <p className="text-[#EA580C]">
                  Cảnh báo: {student.attendance.warning}
                </p>
                <p className="text-[#DC2626]">
                  Cấm thi: {student.attendance.banned}
                </p>
              </td>

              {/* 6. Cột Hành động */}
              <td className="text-left px-4 py-2">
                <button
                  onClick={() => setOpenAttendanceDetail(true)}
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
        currentPage={2}
        totalPages={3}
        totalItems={124}
        itemsPerPage={14}
        onPageChange={(page) => page}
      />
      {openAttendanceDetail && (
        <AttendanceDetailModal onClose={() => setOpenAttendanceDetail(false)} />
      )}
    </div>
  );
};

export default memo(StudentsTable);
