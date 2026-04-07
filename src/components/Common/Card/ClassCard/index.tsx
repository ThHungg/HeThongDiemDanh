import Link from "next/link";
import { memo } from "react";

interface ClassCardProps {
  classCode: string;
  className: string;
  subjectClass: string;
  room: string;
  lecturer: string;
  classSchedule: string;
}
const ClassCard = ({
  classCode,
  className,
  subjectClass,
  room,
  lecturer,
  classSchedule,
}: ClassCardProps) => {
  return (
    <div className="w-full h-full flex flex-col border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-[#8B0000]/5 p-4 flex-1">
        {" "}
        <span className="p-2 text-[12px] bg-[#8B0000] text-white font-bold rounded-lg">
          {classCode}
        </span>
        <h5 className="font-bold mt-[12px] truncate" title={className}>
          {className}
        </h5>
        <span className="text-[11px] text-[#94A3B8] font-bold rounded-lg whitespace-pre-line">
          {classSchedule} - {room}
        </span>
      </div>
      <div className="p-4 bg-white">
        <div className=" space-y-2 mb-[16px]">
          <div className="flex justify-between">
            <span className="text-gray-500 text-[13px] font-semibold">
              Mã lớp:
            </span>
            <p className="text-[14px] font-bold">{subjectClass}</p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-[13px] font-semibold">
              Giảng viên:
            </span>
            <p className="text-[14px] font-bold">{lecturer}</p>
          </div>
        </div>
        <Link
          href="/lecturer/classes/hung"
          className="py-1.5 bg-[#0F172A] text-white font-semibold w-full rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors"
        >
          <span> Xem chi tiết</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 14 14"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M.5 7h10M7 10.5L10.5 7L7 3.5m6.5 0v7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default memo(ClassCard);
