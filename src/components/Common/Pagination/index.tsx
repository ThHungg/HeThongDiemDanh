import { memo, useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const pages = useMemo(() => {
    const result: (number | string)[] = [];

    const siblingCount = 1; // số page cạnh current
    const showLeftDots = currentPage > 3;
    const showRightDots = currentPage < totalPages - 2;

    // Luôn có page 1
    result.push(1);

    if (showLeftDots) {
      result.push("...");
    }

    // range giữa
    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (showRightDots) {
      result.push("...");
    }

    // Luôn có page cuối
    if (totalPages > 1) {
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-wrap items-center px-6 justify-between py-4 bg-[#F8FAFC] border-t border-gray-200">
      {/* Info */}
      <div className="text-[14px] text-[#64748B] font-medium mb-2 md:mb-0">
        Hiển thị{" "}
        <span className="font-bold text-[#8B0000]">{itemsPerPage}</span> trên
        tổng số <span className="font-bold">{totalItems}</span> kết quả
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="min-w-[32px] h-8 px-2 rounded-md border border-gray-300 bg-white text-[#64748B] hover:bg-[#8B0000] hover:text-white transition disabled:opacity-40"
        >
          &lt;
        </button>

        {/* Pages */}
        {pages.map((page, idx) => {
          const isActive = page === currentPage;
          const isDots = page === "...";

          return (
            <button
              key={`${page}-${idx}`}
              disabled={isDots}
              onClick={() => {
                if (page === "...") {
                  // jump nhanh 5 page
                  const next =
                    idx < pages.indexOf(currentPage)
                      ? currentPage - 5
                      : currentPage + 5;

                  onPageChange(Math.max(1, Math.min(totalPages, next)));
                } else {
                  onPageChange(page as number);
                }
              }}
              className={`min-w-[32px] h-8 px-2 rounded-md text-[12px] font-bold transition-all
                ${
                  isActive
                    ? "bg-[#8B0000] text-white border border-[#8B0000] shadow-md scale-105"
                    : isDots
                      ? "text-[#94A3B8] cursor-pointer hover:text-[#8B0000]"
                      : "bg-white border border-gray-300 text-[#334155] hover:border-[#8B0000] hover:text-[#8B0000]"
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="min-w-[32px] h-8 px-2 rounded-md border border-gray-300 bg-white text-[#64748B] hover:bg-[#8B0000] hover:text-white transition disabled:opacity-40"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default memo(Pagination);
