import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import {
  ColumnDef,
  SortingState,
  PaginationState,
  VisibilityState,
  RowSelectionState,
  Table,
  getPaginationRowModel,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';

interface DataTableContextProps<TData> {
  data: TData[];
  rowCount: number | undefined;
  columns: ColumnDef<TData, any>[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  pageSizeOptions: number[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  enableRowSelection: boolean;
  table: Table<TData>;
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
  rowCount: number | undefined;
  columns: ColumnDef<TData, any>[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  enableRowSelection?: boolean;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export function DataTableProvider<TData>({
  children,
  data,
  rowCount,
  columns,
  pageSizeOptions = [10, 20, 30, 50, 100],
  enableRowSelection = false,
  sorting,
  setSorting,
  pagination,
  setPagination,
}: DataTableProviderProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const value = useMemo(
    () => ({
      data,
      rowCount,
      columns,
      sorting,
      setSorting,
      pagination,
      setPagination,
      columnVisibility,
      setColumnVisibility,
      pageSizeOptions,
      rowSelection,
      setRowSelection,
      enableRowSelection,
      table,
    }),
    [
      data,
      rowCount,
      columns,
      sorting,
      pagination,
      columnVisibility,
      pageSizeOptions,
      rowSelection,
      enableRowSelection,
      table,
    ]
  );

  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>;
}
