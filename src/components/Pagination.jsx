import React from "react";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  handlePagination,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createButton = (page, disabled, key, icon = null) => (
    <a
      key={key}
      onClick={() => !disabled && handlePagination(page)}
      className={` ${disabled ? "disabled" : "enabled"} ${
        currentPage === page ? "active" : ""
      }`}
      aria-disabled={disabled}
      role="button"
      aria-label={icon ? `Go to ${icon} page` : `Go to page ${page}`}
      tabIndex="0"
    >
      {icon ? <i className={`fas fa-angle-double-${icon}`}></i> : page}
    </a>
  );

  const renderPaginationButtons = () =>
    [
      createButton(1, currentPage === 1, "first", "left"),
      createButton(currentPage - 1, currentPage === 1, "previous", "left"),
    ].concat(
      [...Array(totalPages).keys()].map((page) =>
        createButton(page + 1, false, `page-${page + 1}`)
      ),
      [
        createButton(
          currentPage + 1,
          currentPage === totalPages,
          "next",
          "right"
        ),
        createButton(totalPages, currentPage === totalPages, "last", "right"),
      ]
    );

  return (
    <nav
      className="pagination"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {renderPaginationButtons()}
    </nav>
  );
};

export default Pagination;
