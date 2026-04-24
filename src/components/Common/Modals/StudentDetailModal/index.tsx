import { memo } from "react";
import * as studentService from "@/services/studentService";
import { useQuery } from "@tanstack/react-query";

const StudentDetailModal = ({
  onClose,
  studentId,
}: {
  onClose: () => void;
  studentId: string;
}) => {
  const getStudentDetail = async (studentId: string) => {
    try {
      const res = await studentService.getStudentByIdService(studentId);
      console.log(res);
      return res;
    } catch (e) {
      console.error(e);
    }
  };

  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-detail", studentId],
    queryFn: () => getStudentDetail(studentId),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-2 bg-white rounded-2xl min-w-[400px]">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 mb-[12px]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#8B0000] rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="text-white"
              >
                <path
                  fill="currentColor"
                  d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2M4 19V5h16l.002 14z"
                />
                <path
                  fill="currentColor"
                  d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"
                />
              </svg>
            </div>
            <h3>Thông tin sinh viên</h3>
          </div>
          <button className="" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
              />
            </svg>
          </button>
        </div>
        <div className="flex gap-12 px-4 pb-4">
          <img
            src="https://thumbs.dreamstime.com/b/student-icon-vector-graduation-mortar-board-school-college-university-glyph-pictogram-male-person-profile-avatar-108392101.jpg"
            alt=""
            className="w-[120px] h-[120px] rounded-2xl border border-gray-200"
          />
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-x-12 gap-y-2">
              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Họ và tên
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">
                  {student?.data?.ten || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Ngày sinh
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">
                  12/12/2026
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Lớp
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">TT35CL07</p>
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Ngành học
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">
                  Công nghệ thông tin
                </p>
              </div>

              <div className="col-span-2">
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Khoa
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">Toán Tin</p>
              </div>

              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Mã sinh viên
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">
                  {student?.data?.ma_sinh_vien || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Điện thoại
                </span>
                <p className="text-[#1E293B] font-bold text-[16px]">
                  {student?.data?.dien_thoai1 || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase">
                  Email 1 (Chính)
                </span>
                <p className="text-[#8B0000] font-bold text-[16px]">
                  {student?.data?.email1 || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#94A3B8] font-bold uppercase  ">
                  Email 2
                </span>
                <p className="text-[#94A3B8] font-bold italic text-[14px]">
                  {student?.data?.email2 || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(StudentDetailModal);
