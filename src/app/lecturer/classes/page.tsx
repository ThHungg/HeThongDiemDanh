"use client";
import ClassCard from "@/components/Common/Card/ClassCard";
import ContentHeader from "@/components/Common/ContentHeader";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { memo } from "react";
import * as classService from "@/services/classService";
import { useQuery } from "@tanstack/react-query";
import { useSemesterStore } from "@/store/useSemesterStore";

const LecturerClassesPage = () => {
  const semester = useSemesterStore((state) => state.selectedSemester);
  const getClasses = async () => {
    const res = await classService.getClassesByLecturerService();
    return res;
  };

  const {
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lecturer-classes", semester],
    queryFn: getClasses,
  });

  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Quản lý danh sách lớp học"
        showExport={false}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
        onAdd={() => {}}
      />
      {classes?.data?.length === 0 ? (
        <div className="w-full mt-10 flex items-center justify-center">
          <p className="text-gray-500 text-[16px]">Không có lớp học nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 ">
          {classes?.data?.map((item: any, index: number) => (
            <ClassCard
              key={index}
              classCode={item.hocPhan?.maHocPhan}
              className={item.hocPhan?.tenHocPhan}
              subjectClass={item.maLopHocPhan}
              classNumber={item.tenLop}
              room={item.room || "A701"}
              classSchedule={item.thoiKhoaBieuChiTiet.map((schedule: any) => {
                return {
                  thu: schedule.thu,
                  tiet: schedule.tiet,
                  phong: schedule.phong,
                };
              })}
              lecturer={item.giangVien?.ten}
              href={`/lecturer/classes/${item.maLopHocPhan}`}
            />
          ))}
        </div>
      )}
      {/* <ClassListTable /> */}
    </div>
  );
};

export default memo(LecturerClassesPage);
