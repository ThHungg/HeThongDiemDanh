"use client";
import FilterBar from "@/components/Common/FilterBar";
import StudentDetailModal from "@/components/Common/Modals/StudentDetailModal";
import Pagination from "@/components/Common/Pagination";
import { memo, useState } from "react";

interface Student {
  id: number;
  code: string;
  name: string;
  scores: (number | null)[];
  note: string;
}

const ClassDetailListTable = () => {
  const [openStudentDetail, setOpenStudentDetail] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      code: "A46588",
      name: "Đặng Thành Hưng",
      scores: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 8, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 9, 8,
      ],
      note: "Hoàn thành",
    },
    {
      id: 2,
      code: "A12345",
      name: "Nguyễn Văn A",
      scores: [
        8, 7, 9, 8, 7, 8, 9, 7, 8, 8, 7, 1, 2, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 9, 8,
      ],
      note: "Khá",
    },
    {
      id: 3,
      code: "A67890",
      name: "Đặng Thành Hưng",
      scores: [
        9, 9, 10, 9, 9, 10, 9, 9, 10, 9, 9, 4, 5, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 9, 8,
      ],
      note: "Xuất sắc",
    },
    {
      id: 4,
      code: "A11111",
      name: "Đặng Thành Hưng",
      scores: [
        6, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6, 6, 7, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 9, 8,
      ],
      note: "Trung bình",
    },
    {
      id: 5,
      code: "A22222",
      name: "Đặng Thành Hưng",
      scores: [
        10, 9, 10, 9, 10, 9, 10, 9, 10, 9, 10, 9, 8, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 9, 8,
      ],
      note: "Xuất sắc",
    },
    {
      id: 6,
      code: "A33333",
      name: "Đặng Thành Hưng",
      scores: [
        7, 8, 7, 8, 7, 8, 7, 8, 7, 8, 7, 6, 7, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 9, 8,
      ],
      note: "Khá",
    },
    {
      id: 7,
      code: "A44444",
      name: "Đặng Thành Hưng",
      scores: [
        5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 7, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 9, 8,
      ],
      note: "Yếu",
    },
    {
      id: 8,
      code: "A55555",
      name: "Đặng Thành Hưng",
      scores: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      note: "Giỏi",
    },
    {
      id: 9,
      code: "A66666",
      name: "Đặng Thành Hưng",
      scores: [
        10, 10, 9, 10, 10, 9, 10, 10, 9, 10, 10, 6, 7, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 9, 8,
      ],
      note: "Xuất sắc",
    },
    {
      id: 10,
      code: "A465888",
      name: "Đặng Thành Hưng",
      scores: [
        6, 6, 7, 6, 6, 7, 6, 6, 4, 6, 6, 6, 7, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 9, 8,
      ],
      note: "Trung bình",
    },
  ]);
  const dates = [
    "01/09 (Ca 1)",
    "01/09 (Ca 2)",
    "08/09",
    "15/09",
    "16/09",
    "17/09",
    "22/09",
    "29/09",
    "06/10",
    "13/10",
    "20/10",
    "27/10",
    "03/11",
    "01/09 (Ca 1)",
    "01/09 (Ca 2)",
    "08/09",
    "15/09",
    "16/09",
    "17/09",
    "22/09",
    "29/09",
    "06/10",
    "13/10",
    "20/10",
    "27/10",
    "03/11",
  ];

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "text-gray-400";
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-amber-500";
    return "text-red-500";
  };

  const handleScoreChange = (
    studentId: number,
    scoreIndex: number,
    value: string,
  ) => {
    if (
      value !== "" &&
      (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 10)
    ) {
      return;
    }
    const newStudents = students.map((student) => {
      if (student.id === studentId) {
        const newScores = [...student.scores];
        newScores[scoreIndex] = value === "" ? null : Number(value);
        return { ...student, scores: newScores };
      }
      return student;
    });
    setStudents(newStudents);
  };
  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      <div className="p-4">
        <FilterBar />
      </div>
      <div>
        <p className="bg-[#F8FAFC] text-[#64748B] py-1 text-center !text-[12px]">
          {" "}
          Nhập điểm (0-10) trực tiếp vào các ô bên dưới
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="border-b border-gray-200">
            <tr className="bg-[#F8FAFC] text-[#64748B] divide-x divide-gray-200">
              <th className="text-left px-4 py-3 font-semibold">STT</th>
              <th className="text-left px-4 py-3 font-semibold">Mã SV</th>
              <th className="text-left px-4 py-3 font-semibold">Họ và tên</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap bg-[#F4E6E6] text-[#8B0000]">
                Điểm TB
              </th>
              {dates.map((date, index) => (
                <th
                  key={index}
                  className="text-left px-4 py-3 font-semibold w-[70px] text-[12px] whitespace-nowrap"
                >
                  {date}
                </th>
              ))}

              <th className="text-left px-4 py-3 font-semibold">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="divide-x divide-gray-200 text-left hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-[#8B0000] font-semibold">
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-semibold">{student.code}</td>
                <td className="px-4 py-3 whitespace-nowrap font-bold">
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer hover:underline text-gray-800"
                      onClick={() => setOpenStudentDetail(true)}
                    >
                      {student.name}
                    </button>

                    <div className="relative group flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 48 48"
                        className="cursor-pointer text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="4"
                        >
                          <path d="M44 24V9H24H4V24V39H24" />
                          <path d="M44 34L30 34" />
                          <path d="M39 29L44 34L39 39" />
                          <path d="M4 9L24 24L44 9" />
                        </g>
                      </svg>

                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                        <div className="bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                          Gửi email cảnh báo tới sinh viên
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center bg-[#F4E6E6] text-[#8B0000] font-semibold">
                  10
                </td>
                {student.scores.map((score, scoreIndex) => (
                  <td
                    key={scoreIndex}
                    className={`px-4 py-3 font-semibold text-center ${getScoreColor(score)}`}
                  >
                    <input
                      type="string"
                      value={score === null || score === undefined ? "" : score}
                      placeholder="-"
                      onChange={(e) =>
                        handleScoreChange(
                          student.id,
                          scoreIndex,
                          e.target.value,
                        )
                      }
                      className={`w-full h-8 text-center font-semibold rounded transition-all outline-none focus:ring-1 focus:ring-[#8B0000] ${
                        score === 0
                          ? "  text-gray-400"
                          : `  ${getScoreColor(score)}`
                      }`}
                    />
                  </td>
                ))}

                <td className="px-4 py-3 whitespace-nowrap">{student.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <Pagination
        currentPage={2}
        totalPages={3} // Tính toán dựa trên data của bạn
        totalItems={124}
        itemsPerPage={14}
        onPageChange={(page) => page}
      /> */}
      {openStudentDetail && (
        <StudentDetailModal onClose={() => setOpenStudentDetail(false)} />
      )}
    </div>
  );
};

export default memo(ClassDetailListTable);
