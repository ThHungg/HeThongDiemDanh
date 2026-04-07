"use client";
import { memo, useState } from "react";
import avatar from "../../../../../public/assets/Images/Avatar.png";

const AttendanceDetailModal = ({ onClose }: { onClose: () => void }) => {
  const [isSelected, setIsSelected] = useState<Number | null>(null);

  const listClass = [
    {
      id: 1,
      code: "IS430",
      name: "Kiểm thử và đảm bảo chất lượng phần mềm",
      subjectClass: "243IS430.02",
      room: "A701",
      lecturer: "TS. Nguyễn Văn A",
      schedule: "Thứ 2, Tiết 1-3\nThứ 7, Tiết 3-4",
    },
    {
      id: 2,
      code: "SE302",
      name: "Công nghệ phần mềm",
      subjectClass: "243SE302.01",
      room: "B2.01",
      lecturer: "ThS. Trần Thị B",
      schedule: "Thứ 3, Tiết 4-5\nThứ 6, Tiết 1-3",
    },
    {
      id: 3,
      code: "IT001",
      name: "Cấu trúc dữ liệu và Giải thuật",
      subjectClass: "243IT001.05",
      room: "C103",
      lecturer: "TS. Lê Hoàng C",
      schedule: "Thứ 4, Tiết 7-9",
    },
    {
      id: 4,
      code: "CS112",
      name: "Phân tích và thiết kế hệ thống",
      subjectClass: "243CS112.H21",
      room: "A2.10",
      lecturer: "PGS.TS. Phạm Văn D",
      schedule: "Thứ 2, Tiết 4-5\nThứ 5, Tiết 7-9",
    },
  ];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-[800px] w-full bg-white rounded-lg ">
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
              <h4 className="!font-bold text-[#8B0000]">Nguyễn Văn An</h4>
              <p className="text-[11px] whitespace-nowrap">
                Lớp: <span className="font-semibold">TT35CL07</span> MSV:{" "}
                <span className="font-semibold">A46588</span>
                <span>
                  {" "}
                  Ngành:{" "}
                  <span className="font-semibold">Công nghệ thông tin</span>
                </span>
              </p>
              <div className="flex gap-1">
                <p className="text-[11px]">
                  Số điện thoại:{" "}
                  <span className="font-semibold">0123456789</span>
                </p>{" "}
                <p className="text-[11px]">
                  Email:{" "}
                  <span className="font-semibold">a46588@thanglong.edu.vn</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-center">
              <h6 className="font-semibold text-[#737373] whitespace-nowrap">
                Điểm TB
              </h6>
              <p>9,1</p>
            </div>
            <div className="h-3/4 mx-4 border-l-1 rounded-2xl border-[#8B0000]/10"></div>
            <button className="text-[14px] flex items-center gap-2 text-white bg-[#8B0000] whitespace-nowrap font-semibold px-3 py-2 rounded-xl hover:bg-[#8B0000]/80 transition-colors">
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
          </div>
        </div>
        {/* Body */}
        <div className="grid grid-cols-12 border-t border-[#8B0000]/10">
          <div className="col-span-4 border-r border-[#8B0000]/10 px-4 py-3">
            <h6 className="font-semibold text-[#737373] mb-[12px]">
              Danh sách môn học
            </h6>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
              {listClass.map((item) => (
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
              ))}
            </div>
          </div>
          <div className="col-span-8  p-3">
            <h4 className="mb-[12px]">Chi tiết môn học</h4>
            <div className="mb-[12px] border border-[#FCEAE8] rounded-2xl overflow-hidden bg-white w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FDF2F0]">
                  <tr>
                    <th className="px-6 py-3 text-[12px] font-semibold text-[#737373]">
                      BUỔI HỌC / NGÀY
                    </th>
                    <th className="px-6 py-3 text-[12px] font-semibold text-[#737373]">
                      ĐIỂM SỐ
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Array(6)
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
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => onClose()}
                className="px-3 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#8B0000]/90 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AttendanceDetailModal);
