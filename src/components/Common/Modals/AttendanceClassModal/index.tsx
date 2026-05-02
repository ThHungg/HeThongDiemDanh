"use client";
import { useQuery } from "@tanstack/react-query";
import { memo, useState } from "react";
import * as classService from "@/services/classService";
interface Student {
  id: number;
  code: string;
  name: string;
  scores: (number | null)[];
  note: string;
}

interface Student {
  id: number;
  code: string;
  name: string;
  scores: (number | null)[];
  note: string;
}

interface ListStudent {
  classCode: string;
  listStudents?: {
    id: number;
    maSinhVien: string;
    ten: string;
    lopChuyenNganh: string;
    diemChuyenCan: number | null;
  }[];
  classSession: {
    ngayHoc: string;
    chiTietTietHoc: {
      tiet: string;
      thu: string;
    };
  }[];
}

const AttendanceClassModal = ({
  onClose,
  isSelectedClasscode,
}: {
  onClose: () => void;
  isSelectedClasscode: string;
}) => {
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
    "01/09 (5-7)",
    "01/09 (6-8)",
    "08/09 (6-7)",
    "15/09 (6-7)",
    "16/09 (6-7)",
    "17/09 (6-7)",
    "22/09 (6-7)",
    "29/09 (6-7)",
    "06/10 (6-7)",
    "13/10 (6-7)",
    "20/10 (6-7)",
    "27/10 (6-7)",
    "03/11 (6-7)",
    "01/09 (11-13)",
    "01/09 (9-11)",
    "08/09 (6-7)",
    "15/09 (6-7)",
    "16/09 (6-7)",
    "17/09 (6-7)",
    "22/09 (6-7)",
    "29/09 (6-7)",
    "06/10 (6-7)",
    "13/10 (6-7)",
    "20/10 (6-7)",
    "27/10 (6-7)",
    "03/11 (6-7)",
  ];

  const getDetailClass = async (classCode: string) => {
    const res = await classService.getDetailClassByLecturerService(classCode);
    return res;
  };

  const {
    data: detailClass,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lecturer-classes", isSelectedClasscode],
    queryFn: () => getDetailClass(isSelectedClasscode),
  });

  console.log("detailClass", detailClass);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-[1200px] w-full bg-white rounded-lg ">
        {/* Header */}
        <div className="px-[24px] pt-[24px]  flex justify-between">
          <div className="">
            <p className="font-semibold w-fit px-2 py-1 rounded-lg text-white text-[11px] bg-[#8B0000]">
              Thông tin lớp học
            </p>
            <h4 className="!font-bold text-[#8B0000]">
              Lập trình hướng đối tượng
            </h4>
            <div className="flex items-center gap-2">
              <p className="text-[12px] flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  className="text-[#8B0000]"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <path d="M7 12h3v4H7z" />
                    <path d="M10 6H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-6" />
                    <path d="M10 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm4 12h2m-2-4h4" />
                  </g>
                </svg>
                Mã lớp: <span>243IS332.02</span>
              </p>
              <p className="text-[12px] flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  className="text-[#8B0000]"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0m4.5 13c-.475-9.333-14.525-9.333-15 0"
                  />
                </svg>
                Giảng viên: <span>ThS. Nguyen Van An</span>
              </p>
            </div>
          </div>
          <button onClick={() => onClose()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className=""
            >
              <path
                fill="currentColor"
                d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
              />
            </svg>
          </button>
        </div>
        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse text-[12px] border border-gray-200">
            <thead className="border-b border-gray-200">
              <tr className="bg-[#F8FAFC] text-[#64748B] divide-x divide-gray-200">
                <th className="text-left px-2 py-2 font-semibold">STT</th>
                <th className="text-left px-2 py-2 font-semibold">Mã SV</th>
                <th className="text-left px-2 py-2 font-semibold">Họ và tên</th>
                <th className="text-left px-2 py-2 font-semibold whitespace-nowrap bg-[#F4E6E6] text-[#8B0000]">
                  Điểm TB
                </th>
                {dates.map((date, index) => (
                  <th
                    key={index}
                    className="text-center px-2 py-2 font-semibold w-[20px]"
                  >
                    {date}
                  </th>
                ))}

                <th className="text-left px-2 py-2 font-semibold">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="divide-x divide-gray-200 text-left hover:bg-gray-50 text-[12px]"
                >
                  <td className="px-2 py-2 text-[#8B0000] font-semibold">
                    {index + 1}
                  </td>
                  <td className="px-2 py-2 font-semibold">{student.code}</td>
                  <td className="px-2 py-2 whitespace-nowrap font-bold">
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
                  <td className="px-2 py-2 whitespace-nowrap text-center bg-[#F4E6E6] text-[#8B0000] font-semibold">
                    10
                  </td>
                  {student.scores.map((score, scoreIndex) => (
                    <td
                      key={scoreIndex}
                      className={`px-2 py-2 font-semibold text-center ${getScoreColor(score)}`}
                    >
                      <input
                        type="string"
                        value={
                          score === null || score === undefined ? "" : score
                        }
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

                  <td className="px-2 py-2 whitespace-nowrap">
                    {student.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(AttendanceClassModal);
