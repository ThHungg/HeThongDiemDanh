"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import { memo, useState } from "react";
import ClassDetailListTable from "@/components/Lecturer/ClassDetailListTable";
import * as classService from "@/services/classService";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const DetailClassPage = () => {
  const classCode = useParams().slug as string;
  const [selectClassCode, setSelectClassCode] = useState<string>(classCode);
  const getDetailClass = async (classCode: string) => {
    const res = await classService.getDetailClassByLecturerService(classCode);
    return res;
  };

  const {
    data: detailClass,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lecturer-classes", classCode],
    queryFn: () => getDetailClass(classCode),
  });
  console.log("detailClass", detailClass);
  return (
    <div className="p-[24px]">
      <ContentHeader
        title={detailClass?.data?.hocPhan?.tenHocPhan}
        courseCode={detailClass?.data?.maLopHocPhan}
        room="A704"
        showExport={true}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
        onAdd={() => {}}
      />
      {/* <div className="flex gap-5 justify-center max-w-2/3 mb-[12px]">
        <StatsCard
          label="Tổng số sinh viên"
          value="45"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M15.5 11a3.5 3.5 0 1 0-7 0a3.5 3.5 0 0 0 7 0" />
                <path d="M15.483 11.35q.484.149 1.017.15a3.5 3.5 0 1 0-3.483-3.85m-2.034 0a3.5 3.5 0 1 0-2.466 3.7M22 16.5c0-2.761-2.462-5-5.5-5m1 8c0-2.761-2.462-5-5.5-5s-5.5 2.239-5.5 5" />
                <path d="M7.5 11.5c-3.038 0-5.5 2.239-5.5 5" />
              </g>
            </svg>
          }
          color="#2563EB"
        />
        <StatsCard
          label="Tổng số sinh viên"
          value="45"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M15.5 11a3.5 3.5 0 1 0-7 0a3.5 3.5 0 0 0 7 0" />
                <path d="M15.483 11.35q.484.149 1.017.15a3.5 3.5 0 1 0-3.483-3.85m-2.034 0a3.5 3.5 0 1 0-2.466 3.7M22 16.5c0-2.761-2.462-5-5.5-5m1 8c0-2.761-2.462-5-5.5-5s-5.5 2.239-5.5 5" />
                <path d="M7.5 11.5c-3.038 0-5.5 2.239-5.5 5" />
              </g>
            </svg>
          }
          color="#2563EB"
        />
      </div> */}
      <ClassDetailListTable
        classCode={classCode}
        setSelectClassCode={setSelectClassCode}
        listStudents={
          detailClass?.data?.danhSachDangKy?.map((student: any) => ({
            id: student.id,
            maSinhVien: student.maSinhVien,
            email1: student.email1,
            email2: student.email2,
            ten: student.ten,
            lopChuyenNganh: student.lopChuyenNganh,
            diemChuyenCan: student.diemChuyenCan,
          })) || []
        }
        classSession={detailClass?.data?.buoi_hoc?.map((session: any) => ({
          ngayHoc: session.ngayHoc,
          chiTietTietHoc: {
            tiet: session.chiTietTietHoc.tiet,
            thu: session.chiTietTietHoc.thu,
          },
        }))}
      />
    </div>
  );
};

export default memo(DetailClassPage);
