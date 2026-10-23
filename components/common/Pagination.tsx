import React, { FC } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const getPaginationGroup = () => {
    const delta = 2; // Số trang hiển thị xung quanh trang hiện tại
    const range = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }

    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Nút Trước */}
      <button
        className={`w-9 h-9 flex items-center justify-center border rounded-full text-sm font-medium transition-colors ${currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-[#105d97]"}`}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {/* Các nút số trang */}
      {getPaginationGroup().map((page, index) => (
        <button
          key={index}
          className={`w-9 h-9 flex items-center justify-center border rounded-full text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-[#105d97] text-white border-[#105d97] shadow-sm"
              : page === "..."
              ? "text-gray-400 cursor-default border-transparent bg-transparent"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-[#105d97]"
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Nút Tiếp */}
      <button
        className={`w-9 h-9 flex items-center justify-center border rounded-full text-sm font-medium transition-colors ${currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-[#105d97]"}`}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
