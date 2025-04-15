import React from 'react';
import { useDataTable } from './context';

interface PaginationProps {
  className?: string;
  siblingCount?: number;
}

export function DataTablePagination<TData>({
  className = '',
  siblingCount = 1
}: PaginationProps) {
  const {
    pagination,
    setPagination,
    pageCount,
    pageSizeOptions,
    totalFilteredRows
  } = useDataTable<TData>();

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageSize = Number(e.target.value);
    setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }));
  };

  const goToPage = (pageIndex: number) => {
    setPagination(prev => ({ ...prev, pageIndex }));
  };

  const pageNumbers = () => {
    const currentPage = pagination.pageIndex;
    const items = [];

    // Number of page buttons to show (not including first/last)
    const maxVisiblePages = siblingCount * 2 + 1;

    // For very few pages, show all without ellipsis
    if (pageCount <= maxVisiblePages + 2) {
      for (let i = 0; i < pageCount; i++) {
        items.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`flex h-9 w-9 items-center justify-center rounded-md p-0 font-semibold transition duration-300 ${currentPage === i
              ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
              : 'border border-white-light bg-white text-dark hover:bg-primary hover:text-white dark:border-[#191e3a] dark:bg-black dark:text-white-light dark:hover:bg-primary'
              }`}
          >
            {i + 1}
          </button>
        );
      }
      return items;
    }

    // Always show first page
    items.push(
      <button
        key="first"
        onClick={() => goToPage(0)}
        className={`flex h-9 w-9 items-center justify-center rounded-md p-0 font-semibold transition duration-300 ${currentPage === 0
          ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
          : 'border border-white-light bg-white text-dark hover:bg-primary hover:text-white dark:border-[#191e3a] dark:bg-black dark:text-white-light dark:hover:bg-primary'
          }`}
      >
        1
      </button>
    );

    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - siblingCount);
    let endPage = Math.min(pageCount - 2, currentPage + siblingCount);

    // Adjust when near the beginning
    if (currentPage < siblingCount + 1) {
      endPage = Math.min(startPage + maxVisiblePages - 1, pageCount - 2);
    }

    // Adjust when near the end
    if (currentPage > pageCount - (siblingCount + 2)) {
      startPage = Math.max(pageCount - maxVisiblePages - 1, 1);
    }

    // Show left ellipsis if needed
    if (startPage > 1) {
      items.push(
        <button key="ellipsis-1" className="flex h-9 w-9 items-center justify-center rounded-md p-0" disabled>
          ...
        </button>
      );
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`flex h-9 w-9 items-center justify-center rounded-md p-0 font-semibold transition duration-300 ${currentPage === i
            ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
            : 'border border-white-light bg-white text-dark hover:bg-primary hover:text-white dark:border-[#191e3a] dark:bg-black dark:text-white-light dark:hover:bg-primary'
            }`}
        >
          {i + 1}
        </button>
      );
    }

    // Show right ellipsis if needed
    if (endPage < pageCount - 2) {
      items.push(
        <button key="ellipsis-2" className="flex h-9 w-9 items-center justify-center rounded-md p-0" disabled>
          ...
        </button>
      );
    }

    // Always show last page
    if (pageCount > 1) {
      items.push(
        <button
          key="last"
          onClick={() => goToPage(pageCount - 1)}
          className={`flex h-9 w-9 items-center justify-center rounded-md p-0 font-semibold transition duration-300 ${currentPage === pageCount - 1
            ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
            : 'border border-white-light bg-white text-dark hover:bg-primary hover:text-white dark:border-[#191e3a] dark:bg-black dark:text-white-light dark:hover:bg-primary'
            }`}
        >
          {pageCount}
        </button>
      );
    }

    return items;
  };

  // Calculate displayed entry range using the totalFilteredRows from context
  const filteredRowsLength = totalFilteredRows;
  const from = filteredRowsLength === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const to = filteredRowsLength === 0 ? 0 : Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredRowsLength);
  const totalEntries = filteredRowsLength;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 mt-5 ${className}`}>
      <div className="flex flex-wrap items-center">
        <div className="flex items-center">
          <span className="whitespace-nowrap">Showing {from} to {to} of {totalEntries} entries</span>
        </div>
        <div className="ltr:ml-3 rtl:mr-3 flex items-center">
          <select
            className="form-select rounded-md border-white-light py-1 ltr:pl-2 rtl:pr-2 text-sm font-semibold text-black dark:border-[#17263c] dark:bg-[#121e32] dark:text-white-dark"
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(0)}
          disabled={pagination.pageIndex === 0}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${pagination.pageIndex === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="First Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 17L6 12L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 17L13 12L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={() => goToPage(Math.max(0, pagination.pageIndex - 1))}
          disabled={pagination.pageIndex === 0}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${pagination.pageIndex === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="Previous Page"
        >
          &lt;
        </button>

        {pageNumbers()}

        <button
          onClick={() => goToPage(Math.min(pageCount - 1, pagination.pageIndex + 1))}
          disabled={pagination.pageIndex >= pageCount - 1}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${pagination.pageIndex >= pageCount - 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="Next Page"
        >
          &gt;
        </button>

        <button
          onClick={() => goToPage(pageCount - 1)}
          disabled={pagination.pageIndex >= pageCount - 1}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${pagination.pageIndex >= pageCount - 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="Last Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 7L11 12L6 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
