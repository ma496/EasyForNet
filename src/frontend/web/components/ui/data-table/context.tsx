import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import { ColumnDef, SortingState, PaginationState, VisibilityState, RowSelectionState, Table, getPaginationRowModel, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table'

interface DataTableContextProps<TData> {
  data: TData[]
  rowCount?: number
  columns: ColumnDef<TData, unknown>[]
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  columnVisibility: VisibilityState
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>
  pageSizeOptions: number[]
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
  enableRowSelection: boolean
  table: Table<TData>
  isFetching?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTableContext = createContext<DataTableContextProps<any> | undefined>(undefined)

export function useDataTable<TData>() {
  const context = useContext(DataTableContext)
  if (context === undefined) {
    throw new Error('useDataTable must be used within a DataTableProvider')
  }
  return context as DataTableContextProps<TData>
}

interface DataTableProviderProps<TData> {
  children: ReactNode
  data: TData[]
  rowCount?: number
  columns: ColumnDef<TData, unknown>[]
  pageSizeOptions?: number[]
  enableRowSelection?: boolean
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  isFetching?: boolean
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
  globalFilter,
  setGlobalFilter,
  isFetching,
}: DataTableProviderProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
  })

  useEffect(() => {
    table.firstPage()
  }, [pagination.pageSize, globalFilter, table])

  const value = useMemo(
    () => ({
      data,
      rowCount,
      columns,
      sorting,
      setSorting,
      pagination,
      setPagination,
      globalFilter,
      setGlobalFilter,
      columnVisibility,
      setColumnVisibility,
      pageSizeOptions,
      rowSelection,
      setRowSelection,
      enableRowSelection,
      table,
      isFetching,
    }),
    [data, rowCount, columns, sorting, pagination, globalFilter, columnVisibility, pageSizeOptions, rowSelection, enableRowSelection, table, isFetching, setSorting, setPagination, setGlobalFilter],
  )

  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
}
