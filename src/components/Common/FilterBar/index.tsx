import { memo } from "react";

const FilterBar = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center justify-center w-full max-w-[300px] px-4">
        <div className="relative w-full max-w-md">
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
            className="bg-white text-[12px] rounded-lg py-1.5 pl-10 pr-4 w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          />
        </div>
      </div>
      <div className="text-[13px] text-[#475569] flex items-center gap-2">
        <span className="">Bộ lọc: </span>
        <select
          name=""
          id=""
          className="bg-white border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-1 focus:ring-[#8B0000] cursor-pointer"
        >
          <option value="">Tất cả khoa</option>
          <option value="">Khoa công nghệ thông tin</option>
          <option value="">Khoa điện tử viễn thông</option>
          <option value="">Khoa cơ khí</option>
        </select>
      </div>
    </div>
  );
};

export default memo(FilterBar);
