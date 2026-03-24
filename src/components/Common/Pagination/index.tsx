import { memo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 10,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center px-6 justify-between py-4 bg-[#F8FAFC]">
      {/* Số lượng hiển thị */}
      <div className="flex gap-2 items-center text-[14px] text-[#64748B] font-semibold">
        <span>Hiển thị</span>
        <div className="">
          <select
            name=""
            id=""
            className="bg-white border border-gray-300 rounded-md"
            defaultValue={itemsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <span>trên {totalItems}</span>
      </div>

      {/* Nút chuyển */}
      <div className="flex items-center gap-2">
        {/* Nút Previous */}
        <button
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 text-[#64748B] bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-[#8B0000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m9.55 12l7.35 7.35q.375.375.363.875t-.388.875t-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675t-.15-.75t.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388t.375.875t-.375.875z"
            />
          </svg>
        </button>

        {/* Danh sách số trang */}
        <div className="flex items-center gap-1.5">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-8 px-2 flex items-center justify-center border rounded-md text-[12px] font-bold transition-all
          ${
            currentPage === page
              ? "bg-[#8B0000] border-[#8B0000] text-white"
              : "text-[#64748B] bg-white border-gray-300 hover:border-[#8B0000] hover:text-[#8B0000]"
          }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Nút Next */}
        <button
          disabled={currentPage === pages.length}
          className="flex items-center justify-center w-8 h-8 text-[#64748B] bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-[#8B0000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(Pagination);
