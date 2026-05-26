"use client";
import { memo, useEffect, useState } from "react";
import * as classService from "@/services/classService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSemesterStore } from "@/store/useSemesterStore";
import { formatClassCode } from "@/utils/formatClassCode";
import Link from "next/link";

const Header = () => {
  const { selectedSemester, setSelectedSemester } = useSemesterStore();
  const queryClient = useQueryClient();
  const getSemesters = async () => {
    const res = await classService.getAllSemestersService();
    return res;
  };

  const { data: Semesters, isLoading } = useQuery({
    queryKey: ["semesters"],
    queryFn: getSemesters,
  });

  useEffect(() => {
    if (Semesters?.data?.length > 0 && !selectedSemester) {
      setSelectedSemester(Semesters.data[0].ma_ky);
    }
  }, [Semesters, selectedSemester, setSelectedSemester, queryClient]);

  // Invalidate all class queries when semester changes
  useEffect(() => {
    if (selectedSemester) {
      queryClient.invalidateQueries({ queryKey: ["lecturer-classes"] });
      queryClient.invalidateQueries({ queryKey: ["all-classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
    }
  }, [selectedSemester, queryClient]);

  const getCurrentClass = async () => {
    const res = await classService.getCurrentClass();
    return res;
  };

  const { data: currentClass } = useQuery({
    queryKey: ["current-class"],
    queryFn: getCurrentClass,
    enabled: !!selectedSemester,
  });

  return (
    <div className="w-full py-2 bg-white border-b border-[#E2E8F0] relative flex items-center justify-between px-4">
      <div></div>
      <div className="flex items-center h-full gap-4">
        {currentClass?.data?.[0] && (
          <Link
            href={`/lecturer/classes/${currentClass.data[0].maLopHocPhan || ""}`}
            className="p-2 bg-[#8B0000]/10 rounded-xl border-[#8B0000] border-[1px] text-center hover:scale-102 transition-transform flex items-center gap-2"
          >
            <div className="flex-col items-center">
              <p className="text-[14px] font-medium text-gray-700">
                Lớp học đang diễn ra:
              </p>
              <p className="text-[16px] font-bold text-[#8B0000]">
                {formatClassCode(
                  currentClass.data[0].maLopHocPhan || "",
                  currentClass.data[0].tenLop || "",
                )}
              </p>
            </div>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-medium text-gray-700">Học kỳ:</p>
          <select
            value={selectedSemester || ""}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-[#F1F5F9] text-[14px] rounded-lg py-2 px-3 border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#8B0000] cursor-pointer min-w-[180px] font-semibold text-gray-800"
          >
            {Semesters?.data?.map((semester: any) => (
              <option key={semester.ma_ky} value={semester.ma_ky}>
                {semester.ma_ky} - {semester.ma_nam}
              </option>
            ))}
          </select>
        </div>

        <div className="border-l-[1px] border-[#E2E8F0] h-6"></div>

        {/* <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="text-gray-600"
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
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></div>
        </div> */}
      </div>
    </div>
  );
};

export default memo(Header);
