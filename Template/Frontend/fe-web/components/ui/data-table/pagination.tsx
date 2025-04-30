import React from 'react';
import { useDataTable } from './context';
import { getTranslation } from '@/i18n';
interface PaginationProps {
  className?: string;
  siblingCount?: number;
}

export function DataTablePagination<TData>({
  className = '',
  siblingCount = 1
}: PaginationProps) {
  const {
    pageSizeOptions,
    rowCount,
    table
  } = useDataTable<TData>();
  const { t } = getTranslation()

  const pageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const items = [];

    // Number of page buttons to show (not including first/last)
    const maxVisiblePages = siblingCount * 2 + 1;

    // For very few pages, show all without ellipsis
    if (table.getPageCount() <= maxVisiblePages + 2) {
      for (let i = 0; i < table.getPageCount(); i++) {
        items.push(
          <button
            key={i}
            onClick={() => table.setPageIndex(i)}
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
        onClick={() => table.firstPage()}
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
    let endPage = Math.min(table.getPageCount() - 2, currentPage + siblingCount);

    // Adjust when near the beginning
    if (currentPage < siblingCount + 1) {
      endPage = Math.min(startPage + maxVisiblePages - 1, table.getPageCount() - 2);
    }

    // Adjust when near the end
    if (currentPage > table.getPageCount() - (siblingCount + 2)) {
      startPage = Math.max(table.getPageCount() - maxVisiblePages - 1, 1);
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
          onClick={() => table.setPageIndex(i)}
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
    if (endPage < table.getPageCount() - 2) {
      items.push(
        <button key="ellipsis-2" className="flex h-9 w-9 items-center justify-center rounded-md p-0" disabled>
          ...
        </button>
      );
    }

    // Always show last page
    if (table.getPageCount() > 1) {
      items.push(
        <button
          key="last"
          onClick={() => table.lastPage()}
          className={`flex h-9 w-9 items-center justify-center rounded-md p-0 font-semibold transition duration-300 ${currentPage === table.getPageCount() - 1
            ? 'bg-primary text-white dark:bg-primary dark:text-white-light'
            : 'border border-white-light bg-white text-dark hover:bg-primary hover:text-white dark:border-[#191e3a] dark:bg-black dark:text-white-light dark:hover:bg-primary'
            }`}
        >
          {table.getPageCount()}
        </button>
      );
    }

    return items;
  };

  // Calculate displayed entry range using the total from context
  const from = rowCount === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const to = rowCount === 0 ? 0 : Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, rowCount || 0);

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 mt-5 ${className}`}>
      <div className="flex flex-wrap items-center">
        <div className="flex items-center">
          <span className="whitespace-nowrap">{t('table_pagination_showing_entries', { from, to, totalRecords: rowCount })}</span>
        </div>
        <div className="ltr:ml-3 rtl:mr-3 flex items-center">
          <select
            className="form-select rounded-md border-white-light py-1 ltr:pl-2 rtl:pr-2 text-sm font-semibold text-black dark:border-[#17263c] dark:bg-[#121e32] dark:text-white-dark"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
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
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${table.getState().pagination.pageIndex === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="First Page"
        >
          <svg className="rtl:scale-x-[-1]" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 17L6 12L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 17L13 12L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${table.getState().pagination.pageIndex === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="Previous Page"
        >
          &lt;
        </button>

        {pageNumbers()}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${table.getState().pagination.pageIndex >= table.getPageCount() - 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="Next Page"
        >
          &gt;
        </button>

        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          className={`flex h-9 w-9 items-center justify-center rounded-md border border-white-light bg-white p-0 font-semibold text-dark transition duration-300 dark:border-[#191e3a] dark:bg-black dark:text-white-light ${table.getState().pagination.pageIndex >= table.getPageCount() - 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary hover:text-white dark:hover:bg-primary'
            }`}
          title="Last Page"
        >
          <svg className="rtl:scale-x-[-1]" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 7L11 12L6 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
