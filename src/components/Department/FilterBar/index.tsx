"use client";
import { memo, useState, useEffect } from "react";
import * as studentService from "@/services/studentService";

interface FilterOptions {
  startDate?: string;
  endDate?: string;
  minScore?: string;
  maxScore?: string;
  khoa?: string;
  nganh?: string;
  maLop?: string;
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
  const [khoa, setKhoa] = useState("");
  const [nganh, setNganh] = useState("");
  const [maLop, setMaLop] = useState("");
  const [khoaList, setKhoaList] = useState<string[]>([]);
  const [nganhList, setNganhList] = useState<string[]>([]);
  const [maLopList, setMaLopList] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Fetch khoa list on mount
  useEffect(() => {
    const fetchKhoaList = async () => {
      try {
        setLoadingFilters(true);
        const response = await studentService.getCoVanFilterDataService();
        if (response?.data) {
          setKhoaList(response.data);
        }
      } catch (error) {
        console.error("Error fetching khoa list:", error);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchKhoaList();
  }, []);

  // Fetch nganh list when khoa changes
  useEffect(() => {
    if (khoa) {
      const fetchNganhList = async () => {
        try {
          const response = await studentService.getCoVanFilterDataService(khoa);
          if (response?.data) {
            setNganhList(response.data);
          }
        } catch (error) {
          console.error("Error fetching nganh list:", error);
        }
      };
      fetchNganhList();
      setNganh("");
      setMaLop("");
    } else {
      setNganhList([]);
      setMaLopList([]);
    }
  }, [khoa]);

  // Fetch maLop list when khoa and nganh change
  useEffect(() => {
    if (khoa && nganh) {
      const fetchMaLopList = async () => {
        try {
          const response = await studentService.getCoVanFilterDataService(
            khoa,
            nganh,
          );
          if (response?.data) {
            setMaLopList(response.data);
          }
        } catch (error) {
          console.error("Error fetching maLop list:", error);
        }
      };
      fetchMaLopList();
      setMaLop("");
    } else {
      setMaLopList([]);
    }
  }, [khoa, nganh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const studentIdRegex = /A\d{5}/g;
      const matches = searchInput.match(studentIdRegex);

      const parsedSearch =
        matches && matches.length > 0 ? matches.join(" ") : searchInput;

      onSearchChange?.(parsedSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleFilterSubmit = () => {
    onFilterChange?.({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minScore: minScore || undefined,
      maxScore: maxScore || undefined,
      khoa: khoa || undefined,
      nganh: nganh || undefined,
      maLop: maLop || undefined,
    });
  };

  const handleAiFilter = async () => {
    const trimmedQuery = aiQuery.trim();
    if (!trimmedQuery) return;

    setAiLoading(true);
    setAiError("");

    try {
      const response =
        await studentService.parseStudentFiltersWithAIService(trimmedQuery);
      const filtersApplied = response?.filtersApplied || {};

      const appliedSearch = filtersApplied.search || "";
      const appliedStartDate = filtersApplied.startDate || "";
      const appliedEndDate = filtersApplied.endDate || "";
      const appliedMinScore =
        filtersApplied.minScore !== undefined &&
        filtersApplied.minScore !== null
          ? String(filtersApplied.minScore)
          : "";
      const appliedMaxScore =
        filtersApplied.maxScore !== undefined &&
        filtersApplied.maxScore !== null
          ? String(filtersApplied.maxScore)
          : "";
      const appliedMaLop = filtersApplied.maLop || "";

      setSearchInput(appliedSearch);
      setStartDate(appliedStartDate);
      setEndDate(appliedEndDate);
      setMinScore(appliedMinScore);
      setMaxScore(appliedMaxScore);
      setMaLop(appliedMaLop);

      onSearchChange?.(appliedSearch);
      onFilterChange?.({
        startDate: appliedStartDate || undefined,
        endDate: appliedEndDate || undefined,
        minScore: appliedMinScore || undefined,
        maxScore: appliedMaxScore || undefined,
        maLop: appliedMaLop || undefined,
      });
    } catch (error) {
      setAiError("Khong the xu ly yeu cau AI. Vui long thu lai.");
    } finally {
      setAiLoading(false);
    }
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
            placeholder="Tìm kiếm theo tên hoặc MSV"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-2 bg-[#F8FAFC] w-full text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
          />
        </div>
      </div>
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
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m3.29 14.71L12 13.41l-3.29 3.3l-1.42-1.42l3.3-3.29l-3.3-3.29l1.42-1.42l3.29 3.3l3.29-3.3l1.42 1.42l-3.3 3.29l3.3 3.29Z"
            />
          </svg>
          Loc nhanh bang AI
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="VD: lop TT35CL07 diem > 5 tu 2024-01-01 den 2024-05-01"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="px-3 py-2 bg-[#F8FAFC] w-full text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all"
          />
          <button
            onClick={handleAiFilter}
            disabled={aiLoading}
            className="px-3 py-2 bg-[#8B0000] text-white text-[12px] font-semibold rounded-lg hover:bg-[#660000] transition-all disabled:opacity-60"
          >
            {aiLoading ? "Dang loc..." : "AI loc"}
          </button>
        </div>
        {aiError && <p className="text-[12px] text-red-600 mt-1">{aiError}</p>}
      </div>
      {/* Bộ lọc thường */}
      <div className="border-t border-gray-200 flex items-end justify-between gap-4">
        <div className="grid grid-cols-7 mt-3 gap-3 w-full">
          {/* Khoa */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">Khóa</label>
            <select
              value={khoa}
              onChange={(e) => setKhoa(e.target.value)}
              disabled={loadingFilters}
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all disabled:opacity-50"
            >
              <option value="">Chọn khóa</option>
              {khoaList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          {/* Nganh */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">
              Ngành
            </label>
            <select
              value={nganh}
              onChange={(e) => setNganh(e.target.value)}
              disabled={!khoa || loadingFilters}
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all disabled:opacity-50"
            >
              <option value="">Chọn ngành</option>
              {nganhList.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          {/* Ma lop */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[13px] text-[#737373]">
              Mã lớp
            </label>
            <select
              value={maLop}
              onChange={(e) => setMaLop(e.target.value)}
              disabled={!khoa || !nganh || loadingFilters}
              className="bg-[#F8FAFC] px-3 py-2 text-[13px] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80 transition-all disabled:opacity-50"
            >
              <option value="">Chọn lớp</option>
              {maLopList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
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
