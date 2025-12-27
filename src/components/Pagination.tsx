type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-end">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
        </li>

        {Array.from({ length: totalPages }).map((_, i) => (
          <li
            key={i}
            className={`page-item ${page === i + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
