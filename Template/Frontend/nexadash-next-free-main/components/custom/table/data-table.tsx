'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import React from 'react'
import { InputSearch } from '@/components/ui/input-search'
import { createPortal } from 'react-dom'
import PaginationTable from '@/components/custom/pagination-table'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterField: string
    isFilterRowBasedOnValue?: string
    isRemovePagination?: boolean
    isFilterRow?: boolean
    isAllRowKey?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterField,
    isFilterRow = false,
    isFilterRowBasedOnValue,
    isRemovePagination = true,
    isAllRowKey,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const TableData = isFilterRow
        ? table
              .getRowModel()
              .rows.filter((rowItems: any) =>
                  isFilterRowBasedOnValue === isAllRowKey
                      ? rowItems
                      : rowItems.original?.status === isFilterRowBasedOnValue,
              )
        : table.getRowModel().rows

    const [mounted, setMounted] = React.useState<boolean>(false)

    React.useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    return (
        <div>
            <div className="w-full overflow-hidden rounded-b-lg bg-white shadow-sm">
                <div>
                    {mounted &&
                        createPortal(
                            <>
                                <InputSearch
                                    placeholder={`Search ${filterField || ''}`}
                                    value={
                                        (table
                                            .getColumn(filterField)

                                            ?.getFilterValue() as string) ?? ''
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn(filterField)
                                            ?.setFilterValue(event.target.value)
                                    }
                                />
                            </>,
                            document.getElementById('search-table')!,
                        )}
                </div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="last:w-0"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            TableData.map((row) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 !text-center text-lg font-semibold"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {isRemovePagination && (
                <PaginationTable table={table} data={data} />
            )}
        </div>
    )
}
