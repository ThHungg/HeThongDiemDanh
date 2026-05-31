"use client";
import ContentHeader from "@/components/Common/ContentHeader";
import { memo, useState } from "react";
import ClassDetailListTable from "@/components/Lecturer/ClassDetailListTable";
import * as classService from "@/services/classService";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import * as attendanceService from "@/services/attendanceService";
import { useMutationHooks } from "@/hooks/useMutationHooks";

const DetailClassPage = () => {
  const classCode = useParams().slug as string;
  const router = useRouter();
  const [selectClassCode, setSelectClassCode] = useState<string>(classCode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExportWarning, setShowExportWarning] = useState(false);
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

  const exportAttendance = useMutationHooks((data: { classCode: string }) =>
    attendanceService.exportAttendanceByClassService(data.classCode),
  );

  const handleExport = async (data: { classCode: string }) => {
    exportAttendance.mutate(data, {
      onSuccess: async (res: any) => {
        console.log(res);
        if (res.data && res.data.fileName) {
          await attendanceService.downloadAttendanceTemplateService(
            res.data.fileName,
          );
        }
      },
    });
  };

  const handleExportClick = () => {
    if (hasUnsavedChanges) {
      setShowExportWarning(true);
      return;
    }

    handleExport({ classCode });
  };
  return (
    <div className="p-[24px]">
      {/* <button
        onClick={() => router.push("/lecturer/classes")}
        className="flex items-center gap-2 mb-4 px-1 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-[12px]">Quay về</span>
      </button> */}
      <ContentHeader
        title={detailClass?.data?.hocPhan?.tenHocPhan}
        courseCode={detailClass?.data?.maLopHocPhan}
        codeClass={detailClass?.data?.tenLop}
        schedule={detailClass?.data?.thoiKhoaBieuChiTiet}
        showExport={true}
        onExport={handleExportClick}
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
        onDirtyChange={setHasUnsavedChanges}
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
      {showExportWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-[520px] p-6">
            <div className="flex items-start gap-3">
              <div className="mt-3 text-[#8B0000]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#1F2937]">
                  Bạn chưa lưu thay đổi điểm số
                </h3>
                <p className="text-[13px] text-[#64748B] mt-1">
                  Xuất báo cáo lúc này sẽ lấy dữ liệu cũ trên hệ thống.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowExportWarning(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-[13px] font-semibold text-[#334155] hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowExportWarning(false);
                  handleExport({ classCode });
                }}
                className="px-4 py-2 rounded-lg bg-[#8B0000] text-white text-[13px] font-semibold hover:bg-[#8B0000]/90"
              >
                Xuất bản cũ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DetailClassPage);
