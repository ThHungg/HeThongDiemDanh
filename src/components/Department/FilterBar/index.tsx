"use client";
import { memo, useState, useCallback } from "react";

interface FilterOptions {
  startDate?: string;
  endDate?: string;
  minScore?: string;
  maxScore?: string;
}

interface FilterBarProps {
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

const FilterBar = ({ onSearchChange, onFilterChange }: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  const handleFilterSubmit = () => {
    onFilterChange?.({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minScore: minScore || undefined,
      maxScore: maxScore || undefined,
    });
  };

  return (
    <div className="bg-white p-5 mb-[12px] rounded-xl shadow-sm">
      {/* Input Tìm kiếm theo tên hoặc MSV */}
      <div className="mb-3">
        <p className="font-bold text-[12px] text-[#737373] flex items-center gap-1 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="text-[#8B0000]"
          >
            <path
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={1}
              d="m20.292 21l-2.661-2.642q-.454.286-.977.464T15.577 19q-1.413 0-2.418-1.005t-1.005-2.418t1.005-2.418t2.418-1.005t2.418 1.005T19 15.577q0 .554-.159 1.087q-.158.532-.503.967L21 20.292zm-2.998-3.706q.706-.706.706-1.717t-.706-1.717t-1.717-.706t-1.718.706t-.705 1.717t.705 1.717q.707.706 1.718.706t1.717-.706M20 10.692h-1V5.616q0-.231-.192-.424T18.384 5H16v2.23H8V5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192H10.5v1H5.616q-.672 0-1.144-.472T4 18.385V5.615q0-.67.472-1.143Q4.944 4 5.616 4h4.636q.14-.586.623-.985q.483-.4 1.125-.4q.654 0 1.134.4q.48.398.62.985h4.63q.672 0 1.144.472T20 5.616zm-7.422-5.691q.23-.23.23-.578t-.23-.578t-.578-.23t-.578.23t-.23.578t.23.578t.578.23t.578-.23"
            />
          </svg>
          Tìm kiếm sinh viên
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc MSV..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="px-3 py-2 bg-[#F8FAFC] w-full text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
          />
        </div>
      </div>
      {/* Bộ lọc thường */}
      <div className="border-t border-gray-200 flex items-end justify-between gap-4">
        <div className="grid grid-cols-4 mt-3 gap-3 w-full">
          {/* Từ ngày */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
            />
          </div>
          {/* Đến ngày */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
            />
          </div>
          {/* Điểm tối thiểu */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">
              Điểm tối thiểu
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="VD: 5"
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
            />
          </div>
          {/* Điểm tối đa */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">
              Điểm tối đa
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="VD: 8"
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
            />
          </div>
        </div>
        <button 
          onClick={handleFilterSubmit}
          className="w-fit h-fit flex justify-center p-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#660000] transition-all shadow-sm active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(FilterBar);
