"use client";
import { memo, useState, useEffect } from "react";

interface SearchBarProps {
  onSearchChange?: (search: string) => void;
  onClassChange?: (classCode: string) => void;
  classes?: Array<{ id: number; ma_lop: string }>;
  selectedClass?: string;
  setSelectedClass?: (classCode: string) => void;
  semester?: string;
}

const SearchBar = ({
  onSearchChange,
  onClassChange,
  classes = [],
  selectedClass = "",
  setSelectedClass,
  semester,
}: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState("");

  // Auto-select lớp đầu tiên khi classes load hoặc kỳ học thay đổi
  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClass?.(classes[0].ma_lop);
      onClassChange?.(classes[0].ma_lop);
    }
  }, [classes, semester, setSelectedClass, onClassChange]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onSearchChange?.(value);
  };

  const handleClear = () => {
    setSearchInput("");
    onSearchChange?.("");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-3">
        {/* Class filter dropdown */}
        {classes.length > 0 && (
          <select
            value={selectedClass}
            onChange={(e) => {
              onClassChange?.(e.target.value);
              setSelectedClass?.(e.target.value);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent text-[14px] bg-white min-w-[150px]"
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => {
              return (
                <option key={cls.id} value={cls.ma_lop}>
                  {cls.ma_lop}
                </option>
              );
            })}
          </select>
        )}

        {/* Search input */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã sinh viên, họ tên..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent text-[14px]"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        {searchInput && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(SearchBar);
