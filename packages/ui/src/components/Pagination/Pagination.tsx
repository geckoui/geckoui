import type { FC } from "react";

import { classNames } from "../../utils/classNames";
import type { PaginationProps } from "./Pagination.types";

/**
 * A pagination component for navigating through multiple pages of content.
 *
 * Automatically handles ellipsis display for large page counts and hides itself
 * when there is only one page. Features previous/next buttons and direct page
 * number navigation.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [page, setPage] = useState(1);
 * <Pagination
 *   currentPage={page}
 *   totalPages={10}
 *   onChange={setPage}
 * />
 *
 * // With API data fetching
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={Math.ceil(totalItems / itemsPerPage)}
 *   onChange={(newPage) => {
 *     setCurrentPage(newPage);
 *     fetchData(newPage);
 *   }}
 * />
 *
 * // Custom styling
 * <Pagination
 *   currentPage={page}
 *   totalPages={20}
 *   onChange={setPage}
 *   className="justify-center mt-8"
 * />
 * ```
 */
const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onChange, className }) => {
  if (totalPages <= 1) return null; // Hide pagination if there is only 1 page

  const getPages = () => {
    const pages = [];
    const ellipsis = "...";

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push(ellipsis);
      pages.push(totalPages);
    } else if (currentPage > totalPages - 4) {
      pages.push(1);
      pages.push(ellipsis);
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push(ellipsis);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push(ellipsis);
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className={classNames("GeckoUIPagination", className)}>
      <button
        className="GeckoUIPagination__arrow"
        disabled={currentPage === 1}
        onClick={() => {
          onChange(currentPage - 1);
        }}
        type="button">
        <span className="GeckoUIPagination__arrow__icon" data-direction="previous" />
      </button>

      <div className="GeckoUIPagination__page-count">
        <span>{currentPage}</span>
        <span>/</span>
        <span>{totalPages}</span>
      </div>

      <div className="GeckoUIPagination__page-buttons">
        {pages.map((page, index) => (
          <button
            className="GeckoUIPagination__page-button"
            data-active={page === currentPage || undefined}
            data-ellipsis={page === "..." || undefined}
            disabled={page === "..."}
            key={index}
            onClick={() => page !== "..." && onChange(Number(page))}
            type="button">
            {page}
          </button>
        ))}
      </div>

      <button
        className="GeckoUIPagination__arrow"
        disabled={currentPage === totalPages}
        onClick={() => {
          onChange(currentPage + 1);
        }}
        type="button">
        <span className="GeckoUIPagination__arrow__icon" data-direction="next" />
      </button>
    </div>
  );
};

export default Pagination;
