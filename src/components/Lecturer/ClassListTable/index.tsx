"use client";
import FilterBar from "@/components/Common/FilterBar";
import Pagination from "@/components/Common/Pagination";
import ProgressBar from "@/components/Common/ProgressBar";
import { Fragment, memo, useState } from "react";

const ClassListTable = () => {
  const [isSelected, setIsSelected] = useState<number | null>(null);

  const handleRowClick = (id: number) => {
    setIsSelected((prevSelected) => (prevSelected === id ? null : id));
  };

  console.log(isSelected);
  const classData = [
    {
      id: 1,
      code: "IS430",
      name: "Công nghệ Blockchain",
      subjectClass: "243IS430.02",
      room: "A701",
      quantity: 40,
      attendance: 75,
      subClasses: [],
    },
    {
      id: 2,
      code: "SE302",
      name: "Công nghệ phần mềm",
      subjectClass: "Multi-Section", // Đánh dấu lớp có nhiều nhóm
      room: "",
      quantity: 40,
      attendance: 75,
      subClasses: [
        {
          id: 21,
          code: "SE302.1",
          name: "Công nghệ phần mềm (Nhóm 1)",
          subjectClass: "243SE302.01",
          room: "A701",
          quantity: 20,
          attendance: 80,
        },
        {
          id: 22,
          code: "SE302.2", // Sửa lại code cho đồng bộ SE302
          name: "Công nghệ phần mềm (Nhóm 2)",
          subjectClass: "243SE302.02",
          room: "A702",
          quantity: 20,
          attendance: 70,
        },
      ],
    },
    {
      id: 3,
      code: "IT001",
      name: "Cấu trúc dữ liệu và Giải thuật",
      subjectClass: "243IT001.05",
      room: "B2.01",
      quantity: 60,
      attendance: 92,
      subClasses: [],
    },
    {
      id: 4,
      code: "CS112",
      name: "Phân tích và thiết kế hệ thống",
      subjectClass: "243CS112.H21",
      room: "C103",
      quantity: 35,
      attendance: 45, // Tỉ lệ thấp để test màu cam/đỏ của ProgressBar
      subClasses: [],
    },
    {
      id: 5,
      code: "SE121",
      name: "Lập trình Web nâng cao",
      subjectClass: "Hybrid",
      room: "",
      quantity: 40,
      attendance: 88,
      subClasses: [
        {
          id: 51,
          code: "SE121.L21",
          name: "Lập trình Web (Thực hành 1)",
          subjectClass: "243SE121.01",
          room: "PM02",
          quantity: 20,
          attendance: 90,
        },
        {
          id: 52,
          code: "SE121.L22",
          name: "Lập trình Web (Thực hành 2)",
          subjectClass: "243SE121.02",
          room: "PM03",
          quantity: 20,
          attendance: 86,
        },
      ],
    },
    {
      id: 6,
      code: "NT106",
      name: "An toàn thông tin mạng",
      subjectClass: "243NT106.01",
      room: "A2.10",
      quantity: 50,
      attendance: 65,
      subClasses: [],
    },
  ];
  return (
    <div className="rounded-xl bg-[#FBFDFD] border border-gray-200 overflow-hidden">
      <div className="p-4">
        <FilterBar />
      </div>
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Mã lớp</th>
            <th className="text-left px-4 py-3 font-semibold">Tên môn học</th>
            <th className="text-left px-4 py-3 font-semibold">Phòng</th>
            <th className="text-left px-4 py-3 font-semibold">Số lượng</th>
            <th className="text-left px-4 py-3 font-semibold">Chuyên cần</th>
            <th className="text-left px-4 py-3 font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white text-[#475569]">
          {classData.map((item) => {
            const hasSubClasses = item.subClasses.length > 0;
            return (
              <Fragment key={item.id}>
                <tr
                  onClick={() => hasSubClasses && handleRowClick(item.id)}
                  className="border-b border-gray-200 hover:bg-gray-50 font-semibold"
                >
                  <td className="text-left px-4 py-3 text-[#8B0000] font-semibold">
                    {item.code}
                  </td>
                  <td className="text-left px-4 py-3 font-semibold text-black">
                    {item.name}
                    <p className="text-[12px] text-gray-500">
                      {item.subjectClass && ` (${item.subjectClass})`}
                    </p>
                  </td>
                  <td className="text-left px-4 py-3">{item.room || "-"}</td>
                  <td className="text-left px-4 py-3">
                    {item.quantity || "-"}
                  </td>
                  <td className="text-left px-4 py-3">
                    <ProgressBar percent={item.attendance} />
                  </td>
                  <td className="text-left px-4 py-3 gap-2">
                    {!hasSubClasses && (
                      <button className="px-2 py-1 border border-gray-200 rounded-md">
                        Chi tiết
                      </button>
                    )}
                    {hasSubClasses && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className={`transition-transform duration-300 ${
                          isSelected === item.id ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </td>
                </tr>
                {hasSubClasses &&
                  isSelected === item.id &&
                  item.subClasses.map((subClass) => (
                    <tr
                      key={subClass.id}
                      className="border-b border-gray-200 text-[#475569] bg-gray-50 hover:bg-gray-100 text-[14px] font-semibold"
                    >
                      <td className="text-left pl-8 px-4 py-3 text-[#8B0000] font-semibold border-l-2 border-[#8B0000]">
                        {subClass.code}
                      </td>
                      <td className="text-left px-4 py-3 font-semibold">
                        {subClass.name}
                        <p className="!text-[12px] text-gray-500">
                          {subClass.subjectClass &&
                            ` (${subClass.subjectClass})`}
                        </p>
                      </td>
                      <td className="text-left px-4 py-3">{subClass.room}</td>
                      <td className="text-left px-4 py-3">
                        {subClass.quantity}
                      </td>
                      <td className="text-left px-4 py-3">
                        <ProgressBar percent={subClass.attendance} />
                      </td>
                      <td className="text-left px-4 py-3 flex items-center gap-2">
                        <button
                          className="px-2 py-1 border border-gray-200 rounded-md
              "
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <Pagination
        currentPage={2}
        totalPages={3} // Tính toán dựa trên data của bạn
        totalItems={124}
        itemsPerPage={14}
        onPageChange={(page) => page}
      />
    </div>
  );
};

export default memo(ClassListTable);
