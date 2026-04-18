import React from "react";
import "./Pagination.css";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // Ép kiểu chắc chắn là số để tránh lỗi "1" + 1 = "11" hoặc NaN
  const current = Number(currentPage) || 1;
  const total = Number(totalPages) || 1;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="pagination-wrapper">
      <button
        className="nav-btn"
        onClick={() => onPageChange(current - 1)}
        // Nút Previous chỉ bị khóa khi trang hiện tại là 1
        disabled={current <= 1}
      >
        &lt;
      </button>

      <div className="page-numbers">
        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${current === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="nav-btn"
        onClick={() => onPageChange(current + 1)}
        // Nút Next chỉ bị khóa khi trang hiện tại >= tổng số trang
        disabled={current >= total}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
