"use client";
import { memo, useState } from "react";

const Header = () => {
  const [selectedYear, setSelectedYear] = useState("2025-2026");

  return (
    <div className="w-full py-2 bg-white border-b border-[#E2E8F0] relative flex items-center justify-between px-4">
      <div></div>
      <div className="flex items-center justify-center w-full max-w-[500px] px-4">
        {/* <div className="relative w-full max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <path
              fill="currentColor"
              d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.398 0-4.064-1.666Q3.808 11.898 3.808 9.5t1.666-4.064t4.064-1.667t4.065 1.667T15.269 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo khoa, lớp, hoặc sinh viên"
            className="bg-[#F1F5F9] text-[12px] rounded-lg py-2 pl-10 pr-4 w-full border border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          />
        </div> */}
      </div>
      <div className="flex items-center h-full gap-4">
        <div className="flex items-center gap-2">
          <p>Năm học:</p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#F1F5F9] text-[14px] rounded-lg py-2 px-3 border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#8B0000] cursor-pointer"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2026-2027">2026-2027</option>
          </select>
        </div>
        <div className="border-l-[1px] border-[#E2E8F0] h-6"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          className="text-gray-600 cursor-pointer hover:text-gray-900"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path strokeDasharray="4" d="M12 3v2">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.2s"
                values="4;0"
              />
            </path>
            <path
              strokeDasharray="30"
              strokeDashoffset="30"
              d="M12 5c-3.31 0 -6 2.69 -6 6l0 6c-1 0 -2 1 -2 2h8M12 5c3.31 0 6 2.69 6 6l0 6c1 0 2 1 2 2h-8"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.2s"
                dur="0.4s"
                to="0"
              />
            </path>
            <path
              strokeDasharray="10"
              strokeDashoffset="10"
              d="M10 20c0 1.1 0.9 2 2 2c1.1 0 2 -0.9 2 -2"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.7s"
                dur="0.2s"
                to="0"
              />
            </path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default memo(Header);
