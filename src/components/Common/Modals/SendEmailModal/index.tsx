"use client";
import { memo, useState } from "react";
import * as notifications from "@/services/notificationsService";
import { useMutationHooks } from "@/hooks/useMutationHooks";
import { toast } from "react-toastify";

interface SendEmailModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  studentData?: {
    name: string;
    msv: string;
    email1: string;
    classCode: string;
  };
  bulkMode?: boolean;
  studentList?: Array<{
    name: string;
    msv: string;
    email1?: string;
    email2?: string;
  }>;
  classCode?: string;
}
const SendEmailModal = ({
  onClose,
  onSuccess,
  studentData,
  bulkMode = false,
  studentList = [],
  classCode = "",
}: SendEmailModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  console.log("studentData", studentData);

  const sendMailToStudent = useMutationHooks(
    (data: {
      msv: string;
      classCode: string;
      subject: string;
      content: string;
    }) =>
      notifications.sendEmailToStudentsService(
        data.msv,
        data.classCode,
        data.subject,
        data.content,
      ),
  );

  const sendBulkMail = useMutationHooks(
    (data: {
      listMsv: string[];
      classCode: string;
      subject: string;
      content: string;
    }) =>
      notifications.sendBulkEmailToStudentsService(
        data.listMsv,
        data.classCode,
        data.subject,
        data.content,
      ),
  );

  const handleSendEmail = async (
    msv: string,
    classCode: string,
    subject: string,
    content: string,
  ) => {
    sendMailToStudent.mutate(
      { msv, classCode, subject, content },
      {
        onSuccess: (res: any) => {
          console.log("res", res);

          toast.success(res?.message || "Email đã được gửi thành công!");
          setTitle("");
          setContent("");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        },
      },
    );
  };

  const handleSendBulkEmail = async (
    listMsv: string[],
    classCode: string,
    subject: string,
    content: string,
  ) => {
    if (listMsv.length === 0) {
      toast.error("Chưa chọn sinh viên nào để gửi email!");
      return;
    }

    sendBulkMail.mutate(
      { listMsv, classCode, subject, content },
      {
        onSuccess: (res: any) => {
          console.log("res", res);
          toast.success(res?.message || "Email đã được gửi thành công!");
          setTitle("");
          setContent("");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        },
      },
    );
  };
  console.log("studentData123", studentData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-h-[90vh] max-w-2xl rounded-xl shadow-2xl overflow-y-auto">
        {/* Header - Màu đỏ sẫm chủ đạo */}
        <div className="bg-[#8B0000] px-6 py-4 flex justify-between items-center text-white overflow-y-auto">
          <div className="flex items-center gap-2">
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
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            <h3 className="font-bold text-lg">Gửi thông báo Email</h3>
          </div>
          <button
            onClick={onClose}
            className="transition-transform duration-200"
          >
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body - Các trường nhập liệu */}
        <div className="p-6 space-y-5">
          {/* Thông tin sinh viên (Read-only view) */}
          {bulkMode && studentList.length > 0 ? (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[12px] font-bold text-slate-600 uppercase mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Danh sách sinh viên ({studentList.length})
              </p>
              <div className="max-h-[150px] overflow-y-auto space-y-2">
                {studentList.map((student, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-white rounded border border-slate-100"
                  >
                    <div className="w-8 h-8 bg-[#8B0000]/10 flex items-center justify-center rounded text-[#8B0000] text-[12px] font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-slate-800">
                        {student.name} - ( {student.msv})
                      </p>
                      {student.email1 && (
                        <p className="text-[10px] text-slate-400 font-normal mt-1">
                          {student.email1}
                        </p>
                      )}
                      {student.email2 && (
                        <p className="text-[10px] text-slate-400 font-normal">
                          {student.email2}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#8B0000]/10 flex items-center justify-center rounded-full text-[#8B0000]">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">
                  {studentData?.name || "Chưa chọn sinh viên"}
                </p>
                <p className="text-[12px] text-slate-500 font-medium">
                  {studentData?.email1 ||
                    studentData?.msv ||
                    "MSV không xác định"}
                </p>
              </div>
            </div>
          )}

          {/* Trường Tiêu đề */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-600 uppercase">
              Tiêu đề thông báo
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Nhập tiêu đề ngắn gọn cho email..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10 transition-all text-[14px]"
            />
          </div>

          {/* Trường Nội dung */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-600 uppercase">
              Nội dung chi tiết
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Nhập nội dung giảng viên muốn gửi đến sinh viên..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10 transition-all text-[14px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-slate-600 uppercase flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Xem trước nội dung thư
            </label>

            <div className="max-h-[280px] overflow-y-auto border border-slate-200 rounded-lg bg-white custom-scrollbar">
              {/* Điểm nhấn tối giản thay vì header khối màu */}
              <div className="h-1 bg-[#8B0000] w-12 m-5 mb-0"></div>

              <div className="p-5 pt-4 text-[14px] leading-relaxed text-[#2d3748]">
                <h4 className="text-[16px] font-bold text-[#1a202c] mb-4 uppercase tracking-tight">
                  {title || "Tiêu đề thông báo..."}
                </h4>

                <p className="mb-3 text-slate-600">Xin chào,</p>

                {/* Nội dung tin nhắn */}
                <div className="my-4 text-[#4a5568] whitespace-pre-wrap break-words min-h-[40px]">
                  {content || (
                    <span className="text-slate-300 italic">
                      Nội dung tin nhắn trống...
                    </span>
                  )}
                </div>

                {/* Thông tin lớp học kiểu tối giản */}
                {studentData?.classCode && (
                  <div className="py-3 border-y border-slate-100 my-4">
                    <span className="text-[12px] text-slate-500">
                      Lớp học phần:
                    </span>
                    <span className="text-[12px] font-semibold text-[#8B0000] ml-2">
                      {studentData?.classCode || "Chưa có mã lớp học phần"}
                    </span>
                  </div>
                )}

                <div className="text-[13px]">
                  <p className="m-0 font-bold text-slate-800">
                    Hệ thống Điểm danh
                  </p>
                  <p className="m-0 text-[11px] text-slate-400">
                    Khoa Công nghệ Thông tin - Trường Đại học Thăng Long
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Các nút điều hướng */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[14px] font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              if (bulkMode) {
                handleSendBulkEmail(
                  studentList.map((s) => s.msv),
                  classCode,
                  title,
                  content,
                );
              } else {
                handleSendEmail(
                  studentData?.msv || "",
                  studentData?.classCode || "",
                  title,
                  content,
                );
              }
            }}
            disabled={sendMailToStudent.isPending || sendBulkMail.isPending}
            className="px-6 py-2 text-[14px] font-bold text-white bg-[#8B0000] hover:bg-[#700000] disabled:bg-[#8B0000]/50 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            {sendMailToStudent.isPending || sendBulkMail.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                {bulkMode ? "Gửi Email" : "Gửi Email"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(SendEmailModal);
