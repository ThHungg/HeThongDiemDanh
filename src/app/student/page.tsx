"use client";
import ClassCard from "@/components/Common/Card/ClassCard";
import StudentInfoCard from "@/components/Common/Card/StudentInfoCard";
import AttendanceDetailModal from "@/components/Common/Modals/AttendanceDetailModal";
import { memo, useState } from "react";
import * as studentService from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";
import { isStudentRole } from "@/utils/isStudent";
import { useUserStore } from "@/store/useUserStore";

const StudentPage = () => {
  const [selectedClassCode, setSelectedClassCode] = useState<string>("");
  const [selectedDetailClass, setSelectedDetailClass] = useState<any>(null);
  const [openAttendanceDetailModal, setOpenAttendanceDetailModal] =
    useState(false);

  const isStudent = isStudentRole();
  const profile = useUserStore((state) => state.profile);

  const getClasses = async () => {
    const res = await studentService.getClassesByStudentService();
    return res;
  };

  const {
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-classes"],
    queryFn: getClasses,
  });

  const handleClassCardClick = (classItem: any, classCode: string) => {
    setSelectedDetailClass(classItem);
    setSelectedClassCode(classCode);
    setOpenAttendanceDetailModal(true);
  };

  console.log(classes);

  return (
    <div className="p-8">
      <StudentInfoCard />
      <h5 className="flex items-center gap-2 font-bold mb-4">
      Update
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
        {classes?.data?.dangKy?.map((item: any, index: number) => (
          <ClassCard
            key={index}
            classCode={item.hocPhan?.maHocPhan}
            className={item.hocPhan?.tenHocPhan}
            classNumber={item.hocPhan?.tenLop}
            subjectClass={item?.maLopHocPhan}
            classSchedule={item.thoiKhoaBieuChiTiet}
            lecturer={item.giangVien?.ten}
            onClick={() => handleClassCardClick(item, item.maLopHocPhan)}
          />
        ))}
      </div>

      {openAttendanceDetailModal && selectedDetailClass && (
        <AttendanceDetailModal
          detailClass={selectedDetailClass}
          onClose={() => {
            setOpenAttendanceDetailModal(false);
            setSelectedDetailClass(null);
            setSelectedClassCode("");
          }}
          isStudent={isStudent}
          studentId={classes?.data?.maSinhVien}
          studentInfo={{
            ten: profile?.ten,
            lopChuyenNganh: profile?.lop_chuyen_nganh,
            maSinhVien: profile?.ma_sinh_vien,
            dienThoai1: profile?.dien_thoai1,
            email1: profile?.email1,
            email2: profile?.email2,
          }}
          avgChuyenCan={classes?.data?.avgChuyenCan}
          classCode={selectedClassCode}
        />
      )}
    </div>
  );
};

export default memo(StudentPage);
