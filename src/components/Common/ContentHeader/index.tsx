"use client";
import { memo } from "react";

interface ContentHeaderProps {
  title?: string;
  courseCode?: string;
  room?: string;

  showExport?: boolean;
  onExport?: () => void;

  addLabel?: string;
  showAdd?: boolean;
  onAdd?: () => void;
}

const ContentHeader = ({
  title,
  courseCode,
  room,
  showExport = false,
  onExport,
  addLabel,
  showAdd = false,
  onAdd,
}: ContentHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2>{title}</h2>
        {courseCode && room && (
          <p className="!text-[14px] text-[#64748B]">
            <span>{courseCode}</span> - <span>Phòng: {room}</span>
          </p>
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
            Xuất báo báo
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
