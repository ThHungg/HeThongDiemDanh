"use client";
import { memo, useState, useEffect } from "react";
import avatar from "../../../../../public/assets/Images/Avatar.png";
import * as studentService from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";
import { formatClassCode } from "@/utils/formatClassCode";
import { formatDate } from "@/utils/formatDatt";
import { styles } from "next/dist/client/components/styles/access-error-styles";
import SendEmailModal from "../SendEmailModal";

const AttendanceDetailModal = ({
  detailClass,
  onClose,
  studentInfo,
  isStudent,
  studentId,
  avgChuyenCan,
  classCode,
}: {
  detailClass?: any;
  onClose: () => void;
  isStudent: boolean;
  studentId: string;
  studentInfo?: any;
  avgChuyenCan: number | null;
  classCode?: string;
}) => {
  const [isSelected, setIsSelected] = useState<Number | null>(0);
  const [attendanceDetail, setAttendanceDetail] = useState<any>(null);
  const [isOpenSendEmail, setIsOpenSendEmail] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  console.log("studentInfo", detailClass);

  const getClassesByStudentId = async (studentId: string) => {
    const res = await studentService.getClassesByStudentId(studentId);
    return res;
  };
  const {
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes", studentId],
    queryFn: () => getClassesByStudentId(studentId),
  });

  const getAttendanceByStudentId = async (classCode: string) => {
    const res = await studentService.getAttendanceByStudentId(classCode);
    return res;
  };

  const getSpecificStudentAttendance = async (
    classCode: string,
    studentId: string,
  ) => {
    const res = await studentService.getSpecificStudentAttendance(
      classCode,
      studentId,
    );
    return res;
  };
  const attendanceCode = isStudent ? classCode : String(isSelected);
  const {
    data: attendance,
    isLoading: isLoadingAttendance,
    error: errorAttendance,
  } = useQuery({
    queryKey: ["attendance", classCode, isSelected, isStudent, studentId],
    queryFn: () => {
      if (isStudent) {
        return getAttendanceByStudentId(attendanceCode || "");
      } else {
        return getSpecificStudentAttendance(attendanceCode || "", studentId);
      }
    },
    enabled: !!(classCode || isSelected) && !!studentId,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (classes?.data?.dangKy && classes.data.dangKy.length > 0) {
      const selectedClass = classes.data.dangKy.find(
        (item: any) => item.maLopHocPhan === classCode,
      );
      if (selectedClass) {
        setIsSelected(selectedClass.maLopHocPhan);
      } else {
        setIsSelected(classes.data.dangKy[0].maLopHocPhan);
      }
    }
  }, [classes, classCode]);

  useEffect(() => {
    if (attendance) {
      setAttendanceDetail(attendance);
    }
  }, [attendance]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-[800px] h-[80vh] w-full bg-white rounded-lg flex flex-col">
        {/* Header */}
        <div className="px-[24px] py-[12px]  flex justify-between">
          <div className="flex items-center gap-2">
            <div>
              {" "}
              <img
                src={avatar.src}
                alt=""
                className="w-[55px] h-[55px] rounded-[12px] object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <h4 className="!font-bold text-[#8B0000]">{studentInfo?.ten}</h4>
              <p className="text-[11px] whitespace-nowrap">
                Lớp:{" "}
                <span className="font-semibold">
                  {studentInfo?.lopChuyenNganh}
                </span>{" "}
                MSV:{" "}
                <span className="font-semibold">{studentInfo?.maSinhVien}</span>
                {/* <span>
                  {" "}
                  Ngành:{" "}
                  <span className="font-semibold">Công nghệ thông tin</span>
                </span> */}
                <span className="text-[11px] ml-2">
                  Số điện thoại:{" "}
                  <span className="font-semibold">
                    {studentInfo?.dienThoai1}
                  </span>
                </span>{" "}
              </p>
              <div className="flex gap-1">
                <p className="text-[11px]">
                  Email1:{" "}
                  <span className="font-semibold">{studentInfo?.email1}</span>
                </p>
                <p className="text-[11px]">
                  Email2:{" "}
                  <span className="font-semibold">{studentInfo?.email2}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-center">
              <h6 className="font-semibold text-[#737373] whitespace-nowrap">
                Điểm TB
              </h6>
              <p className="text-lg font-semibold text-[#15803D]">
                {avgChuyenCan || attendanceDetail?.data?.diemTrungBinh || "-"}
              </p>
            </div>

            {!isStudent && (
              <>
                <div className="h-3/4 mx-4 border-l-1 rounded-2xl border-[#8B0000]/10"></div>
                <button
                  onClick={() => {
                    setIsOpenSendEmail(true);
                    setStudentData({
                      name: studentInfo?.ten,
                      email: studentInfo?.email1,
                      classCode: isSelected,
                    });
                  }}
                  className="text-[14px] flex items-center gap-2 text-white bg-[#8B0000] whitespace-nowrap font-semibold px-3 py-2 rounded-xl hover:bg-[#8B0000]/80 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M4 7H1a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2m-1 4H1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2m-.75 4H1a1 1 0 0 0 0 2h1.25a1 1 0 0 0 0-2m21.68-7.63a.15.15 0 0 0-.15 0l-8.32 7.31a2.4 2.4 0 0 1-1.55.61a1.73 1.73 0 0 1-1.36-.61L6.42 7.4a.14.14 0 0 0-.15 0a.2.2 0 0 0-.1.13l-1.43 9A1.25 1.25 0 0 0 6 18h15a1.8 1.8 0 0 0 1.72-1.5l1.28-9a.12.12 0 0 0-.07-.13"
                    />
                    <path
                      fill="currentColor"
                      d="M13.46 13.92a.94.94 0 0 0 1.32 0l8.28-7.27a.41.41 0 0 0 .14-.38C23.15 6 22.83 6 22.73 6H7.89a.56.56 0 0 0-.55.27a.33.33 0 0 0 0 .38Z"
                    />
                  </svg>
                  Gửi Email
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        {detailClass && (
          <div className="mb-2 mx-2 p-3 bg-[#FDF2F0] rounded-lg border border-[#FCEAE8] shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-[#737373] font-semibold">
                  MÔN HỌC
                </p>
                <p className="text-[13px] font-bold text-[#8B0000]">
                  {detailClass.hocPhan?.tenHocPhan}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#737373] font-semibold">
                  GIẢNG VIÊN
                </p>
                <p className="text-[13px] font-bold">
                  {detailClass.giangVien?.ten}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#737373] font-semibold">
                  LỊCH HỌC
                </p>
                <p className="text-[12px] font-semibold text-[#94A3B8]">
                  {detailClass.thoiKhoaBieuChiTiet
                    ?.map((s: any) => `T${s.thu} ${s.tiet} (${s.phong})`)
                    ?.join(" / ")}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#737373] font-semibold">
                  SỨC CHỨA
                </p>
                <p className="text-[13px] font-bold">
                  {detailClass.hocPhan?.soLuongDangKy} /{" "}
                  {detailClass.hocPhan?.sucChua}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-12 border-t border-[#8B0000]/10 flex-1 overflow-auto">
          {!isStudent && (
            <div className="col-span-4 border-r border-[#8B0000]/10 px-4 py-3">
              <h6 className="font-semibold text-[#737373] mb-[12px]">
                Danh sách môn học
              </h6>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] overflow-auto">
                {/* {listClass.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setIsSelected(item.id)}
                    className={
                      isSelected === item.id
                        ? "border border-[#8B0000] rounded-lg p-2 bg-[#FFF0EE]"
                        : "border border-[#8B0000]/10 rounded-lg p-2"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-semibold text-[#737373]">
                        {item.subjectClass}
                      </p>
                      <p
                        className={`px-2 text-[12px] font-semibold rounded-lg ${
                          isSelected === item.id
                            ? "bg-[#FEE2E2] text-[#8B0000]"
                            : "bg-[#DCFCE7] text-[#15803D]"
                        }`}
                      >
                        9,5
                      </p>
                    </div>
                    <h6 className="font-bold !text-[14px]">{item.name}</h6>
                    <p className="text-[12px] font-semibold text-[#737373]">
                      Giảng viên: {item.lecturer}
                    </p>
                  </div>
                ))} */}
                {classes?.data?.dangKy?.map((item: any, index: number) => (
                  <div
                    key={item.index}
                    onClick={() => setIsSelected(item.maLopHocPhan)}
                    className={
                      isSelected === item.maLopHocPhan
                        ? "border border-[#8B0000] rounded-lg p-2 bg-[#FFF0EE]"
                        : "border border-[#8B0000]/10 rounded-lg p-2"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-semibold text-[#737373]">
                        {formatClassCode(
                          item.maLopHocPhan,
                          item.hocPhan?.tenLop,
                        )}
                      </p>
                      <p
                        className={`px-2 text-[12px] font-semibold rounded-lg ${
                          isSelected === item.id
                            ? "bg-[#FEE2E2] text-[#8B0000]"
                            : "bg-[#DCFCE7] text-[#15803D]"
                        }`}
                      >
                        {item.diemChuyenCan || "N/A"}
                      </p>
                    </div>
                    <h6 className="font-bold !text-[14px]">
                      {item.hocPhan?.tenHocPhan}
                      <br />
                      <span className="text-[11px] text-[#94A3B8] font-bold rounded-lg">
                        {item.thoiKhoaBieuChiTiet
                          ?.map((s: any) => `T${s.thu} ${s.tiet} (${s.phong})`)
                          ?.join(" / ")}
                      </span>
                    </h6>
                    <p className="text-[12px] font-semibold text-[#737373]">
                      Giảng viên: {item.giangVien?.ten}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            className={`${isStudent ? "col-span-12" : "col-span-8"} px-4 py-3 flex flex-col min-h-0`}
          >
            <h4 className="mb-2 shrink-0">Chi tiết môn học</h4>
            <div className="flex-1 border border-[#FCEAE8] rounded-2xl overflow-y-auto bg-white w-full min-h-0">
              <table className="w-full text-left border-collapse h-full">
                <thead className="bg-[#FDF2F0] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-[12px] font-semibold text-[#737373]">
                      NGÀY
                    </th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-[#737373]">
                      TIẾT
                    </th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-[#737373] whitespace-nowrap w-20">
                      ĐIỂM SỐ
                    </th>
                  </tr>
                </thead>

                <tbody className="">
                  {/* {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={index} className="border-b border-[#8B0000]/10">
                        <td className="px-6 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-bold">
                              Thứ Hai, 15/10
                            </span>
                            <span className="text-[11px] text-[#737373]/80">
                              Ca Sáng (7:30 - 9:30)
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-3">
                          <span className="text-[16px] font-black ">9,5</span>
                        </td>
                      </tr>
                    ))} */}
                  {attendanceDetail?.data?.buoiHoc.map(
                    (item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b flex-1 border-[#8B0000]/10 max-h-[60px]"
                      >
                        <td className="px-4 py-2">
                          <span className="text-[13px] font-semibold">
                            {formatDate(item.ngayHoc)}
                          </span>
                        </td>

                        <td className="px-4 py-2">
                          <span className="text-[13px] font-semibold">
                            Tiết {item.thoiGianChiTiet.batDau}-
                            {item.thoiGianChiTiet.ketThuc}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-right w-20">
                          <span className="text-[14px] font-bold">
                            {item.diemSo}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-3 shrink-0">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#8B0000]/90 transition-colors font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpenSendEmail && (
        <SendEmailModal
          onClose={() => setIsOpenSendEmail(false)}
          studentData={studentData}
        />
      )}
    </div>
  );
};

export default memo(AttendanceDetailModal);
