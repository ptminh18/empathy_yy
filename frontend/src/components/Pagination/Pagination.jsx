import "./Pagination.css";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const current = Number(currentPage) || 1;
  const total = Number(totalPages);
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  console.log("total: ", total);
  return (
    <div className="pagination-wrapper">
      <button
        className="nav-btn"
        onClick={() => onPageChange(current)}
        // disabled={current <= 1}
      >
        &lt;
      </button>

      <div className="page-numbers">
        {pages.map((page) => (
          <div>{page}</div>
        ))}
      </div>

      <button
        className="nav-btn"
        onClick={() => onPageChange(current + 1)}
        disabled={current >= total}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
