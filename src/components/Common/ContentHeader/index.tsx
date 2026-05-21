"use client";
import { formatClassCode } from "@/utils/formatClassCode";
import { memo } from "react";

interface ContentHeaderProps {
  title?: string;
  courseCode?: string;
  detail?: any;
  schedule?: Array<{
    tkbId?: number;
    tiet?: string;
    thu?: number;
    phong?: string;
  }>;
  codeClass?: string;

  showExport?: boolean;
  onExport?: () => void;

  addLabel?: string;
  showAdd?: boolean;
  onAdd?: () => void;
}

const ContentHeader = ({
  title,
  courseCode,
  detail,
  schedule,
  codeClass,
  showExport = false,
  onExport,
  addLabel,
  showAdd = false,
  onAdd,
}: ContentHeaderProps) => {
  console.log("detail", detail);
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2>
          {title}{" "}
          {courseCode && (
            <span>
              {" "}
              <span className="font-semibold text-[14px] text-[#64748B] items-center">
                ( {formatClassCode(courseCode || "", codeClass || "")})
              </span>
            </span>
          )}
        </h2>
        {schedule && schedule.length > 0 && (
          <div className="!text-[14px] text-[#64748B]">
            <div className="mt-1 space-y-1">
              {schedule.map((item, index) => (
                <p key={index} className="text-[13px]">
                  Thứ {item.thu}, Tiết {item.tiet}, Phòng: {item.phong}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {showExport && (
          <button
            onClick={onExport}
            className="px-4 py-2 bg-white border-gray-300 border rounded-lg text-[14px] font-semibold items-center flex gap-1 hover:scale-105 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 4v12.25L17.25 11l.75.66l-6.5 6.5l-6.5-6.5l.75-.66L11 16.25V4zM3 19h1v2h15v-2h1v3H3z"
              />
            </svg>
            Xuất báo cáo
          </button>
        )}
        {showAdd && (
          <button className="px-4 py-2 bg-[#8B0000] rounded-lg text-[14px] font-semibold text-white flex gap-1 items-center hover:scale-105 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
            </svg>
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(ContentHeader);
