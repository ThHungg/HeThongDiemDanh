"use client";
import ClassCard from "@/components/Common/Card/ClassCard";
import StudentInfoCard from "@/components/Common/Card/StudentInfoCard";
import AttendanceDetailModal from "@/components/Common/Modals/AttendanceDetailModal";
import { memo, useState } from "react";

const StudentPage = () => {
  const [openAttendanceDetailModal, setOpenAttendanceDetailModal] =
    useState(false);

  const classData = [
    {
      id: 1,
      code: "IS430",
      name: "Kiểm thử và đảm bảo chất lượng phần mềm",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
      averageAttendance: 9.5,
      attendanceProgress: {
        attended: 12,
        total: 15,
        percentage: 80,
      },
    },
    {
      id: 2,
      code: "IS431",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS431.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 3, Tiết 4-5",
      averageAttendance: 8.8,
      attendanceProgress: {
        attended: 9,
        total: 10,
        percentage: 90,
      },
    },
    {
      id: 3,
      code: "IS432",
      name: "Phát triển ứng dụng di động",
      subjectClass: "243IS432.05",
      room: "A702",
      lecturer: "ThS. Lê Thị Bình",
      schedule: "Thứ 4, Tiết 1-3\nThứ 6, Tiết 1-3",
      averageAttendance: 4.5,
      attendanceProgress: {
        attended: 5,
        total: 15,
        percentage: 33,
      },
    },
    {
      id: 4,
      code: "IS433",
      name: "An toàn thông tin",
      subjectClass: "243IS433.01",
      room: "B201",
      lecturer: "TS. Trần Văn Cường",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
      averageAttendance: 10,
      attendanceProgress: {
        attended: 15,
        total: 15,
        percentage: 100,
      },
    },
    {
      id: 5,
      code: "IS434",
      name: "Hệ quản trị CSDL",
      subjectClass: "243IS434.03",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 5, Tiết 7-9",
      averageAttendance: 7.2,
      attendanceProgress: {
        attended: 10,
        total: 12,
        percentage: 83,
      },
    },
    {
      id: 6,
      code: "IS435",
      name: "Phân tích dữ liệu",
      subjectClass: "243IS435.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
      averageAttendance: 9.0,
      attendanceProgress: {
        attended: 14,
        total: 15,
        percentage: 93,
      },
    },
    {
      id: 7,
      code: "IS436",
      name: "Trí tuệ nhân tạo",
      subjectClass: "243IS436.04",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 3, Tiết 1-3\nThứ 5, Tiết 1-2",
      averageAttendance: 6.5,
      attendanceProgress: {
        attended: 8,
        total: 15,
        percentage: 53,
      },
    },
    {
      id: 8,
      code: "IS437",
      name: "Kiến trúc phần mềm",
      subjectClass: "243IS437.01",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
      averageAttendance: 9.2,
      attendanceProgress: {
        attended: 11,
        total: 12,
        percentage: 91,
      },
    },
  ];
  return (
    <div className="p-8">
      <StudentInfoCard />
      <h5 className="flex items-center gap-2 font-bold mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          className="text-[#8D0000]"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"
          />
        </svg>
        Lớp học của tôi
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 ">
        {classData.map((item, index) => (
          <ClassCard
            key={index}
            classCode={item.code}
            className={item.name}
            subjectClass={item.subjectClass}
            room={item.room}
            classSchedule={item.schedule}
            lecturer={item.lecturer}
            averageAttendance={item.averageAttendance}
            attendanceProgress={item.attendanceProgress}
            onClick={() => setOpenAttendanceDetailModal(true)}
          />
        ))}
      </div>
      {openAttendanceDetailModal && (
        <AttendanceDetailModal
          isStudent={true}
          onClose={() => setOpenAttendanceDetailModal(false)}
        />
      )}
    </div>
  );
};

export default memo(StudentPage);
