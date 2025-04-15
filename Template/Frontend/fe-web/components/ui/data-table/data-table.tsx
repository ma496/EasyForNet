import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  FilterFn,
} from '@tanstack/react-table';
import { useDataTable } from './context';
import { rankItem } from '@tanstack/match-sorter-utils';
import { SortIcon } from './sort-icon';

// Global filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the ranking info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface DataTableProps<TData> {
  className?: string;
}

export function DataTable<TData>({ className = '' }: DataTableProps<TData>) {
  const {
    data,
    columns,
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    pageCount,
    setPageCount,
    rowSelection,
    setRowSelection,
    enableRowSelection,
    setTable,
  } = useDataTable<TData>();

  // Extract global filter value
  const globalFilter = columnFilters.find(filter => filter.id === 'global')?.value as string || '';

  // Track previous filter state to detect changes
  const [prevGlobalFilter, setPrevGlobalFilter] = useState(globalFilter);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnVisibility,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
    manualPagination: false,
  });

  // Store table instance in context
  useEffect(() => {
    if (setTable) {
      setTable(table);
    }
  }, [table, setTable]);

  // Monitor global filter changes and reset pagination if needed
  useEffect(() => {
    // If global filter changed and there are no filtered rows, reset to page 0
    if (globalFilter !== prevGlobalFilter) {
      setPrevGlobalFilter(globalFilter);

      const filteredRowsCount = table.getFilteredRowModel().rows.length;
      if (filteredRowsCount === 0) {
        setPagination(prev => ({
          ...prev,
          pageIndex: 0
        }));
      }
    }
  }, [globalFilter, prevGlobalFilter, table, setPagination]);

  // Update pageCount when data, pagination, or filters change
  useEffect(() => {
    const filteredRowsCount = table.getFilteredRowModel().rows.length;
    setPageCount(Math.ceil(filteredRowsCount / pagination.pageSize));

    // Reset to first page if current page would be out of bounds
    if (pagination.pageIndex > 0 && filteredRowsCount > 0 && pagination.pageIndex >= Math.ceil(filteredRowsCount / pagination.pageSize)) {
      setPagination(prev => ({
        ...prev,
        pageIndex: 0
      }));
    }
  }, [table, pagination.pageSize, setPageCount, columnFilters, pagination.pageIndex, setPagination]);

  return (
    <div className="relative overflow-x-auto">
      <table className={`w-full table-auto ${className}`}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="p-4 font-semibold text-left first:rounded-tl-md last:rounded-tr-md"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex items-center group ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <SortIcon isSorted={header.column.getIsSorted()} />}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`border-b border-white-light/40 dark:border-[#191e3a] hover:bg-white-light/20 dark:hover:bg-[#1a2941]/40 ${row.getIsSelected() ? 'bg-primary/10 dark:bg-primary/20' : ''
                  }`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-6">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
