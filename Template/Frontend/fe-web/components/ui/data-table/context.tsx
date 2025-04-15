import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import {
  ColumnDef,
  SortingState,
  PaginationState,
  VisibilityState,
  ColumnFiltersState,
  RowSelectionState,
  Table,
} from '@tanstack/react-table';

interface DataTableContextProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  pageSizeOptions: number[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  enableRowSelection: boolean;
  table?: Table<TData>;
  setTable?: React.Dispatch<React.SetStateAction<Table<TData> | undefined>>;
  totalFilteredRows: number;
  setTotalFilteredRows: React.Dispatch<React.SetStateAction<number>>;
}

const DataTableContext = createContext<DataTableContextProps<any> | undefined>(undefined);

export function useDataTable<TData>() {
  const context = useContext(DataTableContext);
  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context as DataTableContextProps<TData>;
}

interface DataTableProviderProps<TData> {
  children: ReactNode;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialPageSize?: number;
  initialPageIndex?: number;
  pageSizeOptions?: number[];
  enableRowSelection?: boolean;
}

export function DataTableProvider<TData>({
  children,
  data,
  columns,
  initialPageSize = 10,
  initialPageIndex = 0,
  pageSizeOptions = [10, 20, 30, 50, 100],
  enableRowSelection = false,
}: DataTableProviderProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageCount, setPageCount] = useState(Math.ceil(data.length / initialPageSize));
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [table, setTable] = useState<Table<TData>>();
  const [totalFilteredRows, setTotalFilteredRows] = useState<number>(data.length);

  // Update totalFilteredRows when the table or filters change
  useEffect(() => {
    if (table) {
      const filteredCount = table.getFilteredRowModel().rows.length;
      setTotalFilteredRows(filteredCount);
    }
  }, [table, columnFilters]);

  const value = useMemo(
    () => ({
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
      pageSizeOptions,
      rowSelection,
      setRowSelection,
      enableRowSelection,
      table,
      setTable,
      totalFilteredRows,
      setTotalFilteredRows,
    }),
    [
      data,
      columns,
      sorting,
      pagination,
      columnVisibility,
      columnFilters,
      pageCount,
      pageSizeOptions,
      rowSelection,
      enableRowSelection,
      table,
      totalFilteredRows,
    ]
  );

  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>;
}
