import ListDepartment from "@/components/DepartmentPage/ListDepartment";
import { memo } from "react";

const DepartmentPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 justify-between mb-[12px]">
        <h2>Danh sách các khoa</h2>
        <button className="bg-[#135BEC] p-2 text-white text-[14px] rounded-lg flex items-center gap-1 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
          </svg>
          Thêm khoa mới
        </button>
      </div>
      <ListDepartment />
    </div>
  );
};

export default memo(DepartmentPage);
