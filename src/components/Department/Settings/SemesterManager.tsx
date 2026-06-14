"use client";
import { memo } from "react";
import * as classServices from "../../../services/classService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "src/components/Common/Loading";
import { useMutationHooks } from "src/hooks/useMutationHooks";
import { toast } from "react-toastify";

const SemesterManager = () => {
  const queryClient = useQueryClient();

  const getAllSemesters = async () => {
    const res = await classServices.getAllSemestersService();
    return res;
  };

  const { data: allSemesters, isLoading } = useQuery({
    queryKey: ["all-semesters"],
    queryFn: getAllSemesters,
  });

  const semestersList = allSemesters?.data || [];

  const toggleLockMutation = useMutationHooks(
    (data: { maKy: string; trangThai: number }) =>
      classServices.toggleLockSemester(data.maKy, data.trangThai),
  );

  const handleToggleLock = (maKy: string, currentStatus: number) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    toggleLockMutation.mutate(
      { maKy, trangThai: nextStatus },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Cập nhật trạng thái thành công");
          queryClient.invalidateQueries({ queryKey: ["all-semesters"] });
          queryClient.invalidateQueries({ queryKey: ["semesters"] });
        },
      },
    );
  };

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-gray-100 flex items-start gap-4">
        <div className="p-3 bg-amber-50 rounded-full text-amber-600 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-gray-800">
            Cấu hình Khóa học kỳ
          </h3>
          <p className="text-[13px] text-gray-500 ">
            Khi học kỳ bị khóa, giảng viên của các lớp học phần thuộc học kỳ đó
            sẽ{" "}
            <span className="font-semibold text-red-600">
              không thể chỉnh sửa thông tin điểm danh
            </span>{" "}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-left text-[14px] text-gray-600">
            <thead className="bg-slate-50 text-[13px] text-gray-500 uppercase tracking-wider border-b border-gray-200 font-semibold">
              <tr>
                <th className="px-6 py-4">Mã học kỳ</th>
                <th className="px-6 py-4">Tên học kỳ</th>
                <th className="px-6 py-4">Năm học</th>
                <th className="px-6 py-4 text-center">Học kỳ mặc định</th>
                <th className="px-6 py-4 text-center">Trạng thái khóa</th>
                <th className="px-6 py-4 text-center">Thao tác khóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Loading text="Đang tải.." />
                  </td>
                </tr>
              ) : semestersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Không tìm thấy học kỳ nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                semestersList.map((semester: any) => {
                  const isLocked = semester.trang_thai === 1;
                  const isDefault = semester.mac_dinh === 1;
                  const isPending =
                    toggleLockMutation.isPending &&
                    toggleLockMutation.variables?.maKy === semester.ma_ky;

                  return (
                    <tr
                      key={semester.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {semester.ma_ky}
                      </td>
                      <td className="px-6 py-4">{semester.ten_ky}</td>
                      <td className="px-6 py-4">{semester.ma_nam}</td>
                      <td className="px-6 py-4 text-center">
                        {isDefault ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Hiện tại
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Đã khóa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            Đang mở
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <button
                            disabled={isPending}
                            onClick={() =>
                              handleToggleLock(
                                semester.ma_ky,
                                semester.trang_thai,
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                              isLocked ? "bg-[#8B0000]" : "bg-gray-200"
                            } ${
                              isPending ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            title={
                              isLocked ? "Bấm để mở khóa" : "Bấm để khóa học kỳ"
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                isLocked ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(SemesterManager);
