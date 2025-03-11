'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, MoveDown, MoveUp } from 'lucide-react'
import Image from 'next/image'

export type ITable = {
    id: string
    receptionist: {
        image: string
        name: string
    }
    sales_id: string
    category: string
    location: string
    date: string
    status: 'done' | 'pending' | 'cancelled'
}

export const columns: ColumnDef<ITable>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        accessorFn: (row) => row.receptionist.name,
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="inline-flex items-center -space-x-[5px]">
                        <MoveDown
                            className={`size-2.5 shrink-0 text-black ${column.getIsSorted() === 'asc' && 'text-gray-500'}`}
                        />
                        <MoveUp
                            className={`size-2.5 shrink-0 text-gray-500 ${column.getIsSorted() === 'asc' && '!text-black'}`}
                        />
                    </span>
                    Sales Receptionist
                </button>
            )
        },
        cell: ({ row }) => {
            const image = row.original.receptionist

            return (
                <div className="flex items-center gap-2">
                    <div className="size-6 overflow-hidden">
                        <Image
                            src={image.image}
                            alt={image.name}
                            className="size-full object-cover"
                            width={24}
                            height={24}
                        />
                    </div>
                    <span>{image.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'sales_id',
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="inline-flex items-center -space-x-[5px]">
                        <MoveDown
                            className={`size-2.5 shrink-0 text-black ${column.getIsSorted() === 'asc' && 'text-gray-500'}`}
                        />
                        <MoveUp
                            className={`size-2.5 shrink-0 text-gray-500 ${column.getIsSorted() === 'asc' && '!text-black'}`}
                        />
                    </span>
                    ID
                </button>
            )
        },
        cell: ({ row }) => (
            <Badge className="bg-gray-400 text-black">
                {row.getValue('sales_id')}
            </Badge>
        ),
    },

    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="inline-flex items-center -space-x-[5px]">
                        <MoveDown
                            className={`size-2.5 shrink-0 text-black ${column.getIsSorted() === 'asc' && 'text-gray-500'}`}
                        />
                        <MoveUp
                            className={`size-2.5 shrink-0 text-gray-500 ${column.getIsSorted() === 'asc' && '!text-black'}`}
                        />
                    </span>
                    Category
                </button>
            )
        },
        cell: ({ row }) => <div>{row.getValue('category')}</div>,
    },
    {
        accessorKey: 'location',
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="inline-flex items-center -space-x-[5px]">
                        <MoveDown
                            className={`size-2.5 shrink-0 text-black ${column.getIsSorted() === 'asc' && 'text-gray-500'}`}
                        />
                        <MoveUp
                            className={`size-2.5 shrink-0 text-gray-500 ${column.getIsSorted() === 'asc' && '!text-black'}`}
                        />
                    </span>
                    Location
                </button>
            )
        },
        cell: ({ row }) => <div>{row.getValue('location')}</div>,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="inline-flex items-center -space-x-[5px]">
                        <MoveDown
                            className={`size-2.5 shrink-0 text-black ${column.getIsSorted() === 'asc' && 'text-gray-500'}`}
                        />
                        <MoveUp
                            className={`size-2.5 shrink-0 text-gray-500 ${column.getIsSorted() === 'asc' && '!text-black'}`}
                        />
                    </span>
                    Date
                </button>
            )
        },
        cell: ({ row }) => <div>{row.getValue('date')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span className="inline-flex items-center -space-x-[5px]">
                        <MoveDown
                            className={`size-2.5 shrink-0 text-black ${column.getIsSorted() === 'asc' && 'text-gray-500'}`}
                        />
                        <MoveUp
                            className={`size-2.5 shrink-0 text-gray-500 ${column.getIsSorted() === 'asc' && '!text-black'}`}
                        />
                    </span>
                    Status
                </button>
            )
        },
        cell: ({ row }) => (
            <Badge
                variant={
                    row.getValue('status') === 'done'
                        ? 'green'
                        : row.getValue('status') === 'pending'
                          ? 'orange'
                          : 'red'
                }
                className="capitalize"
            >
                {row.getValue('status')}
            </Badge>
        ),
    },
]
