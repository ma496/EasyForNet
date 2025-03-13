'use client'

import { DataTable } from '@/components/custom/table/data-table'
import PageHeading from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { CalendarCheck, Plus, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface ICustomer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  lastPurchase: string
  totalSpent: string
}

const columns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <span className="font-medium">{row.original.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'company',
    header: 'Company',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === 'active'
              ? 'success'
              : status === 'inactive'
                ? 'danger'
                : 'default'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastPurchase',
    header: 'Last Purchase',
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Spent',
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Purchase History</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const Customers = () => {
  const [date, setDate] = useState<Date>()
  const [mainDate, setMainDate] = useState<Date>()

  const data: ICustomer[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      company: 'Tech Solutions Inc.',
      email: 'alex.t@techsolutions.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      lastPurchase: 'Mar 28, 2024',
      totalSpent: '$15,750',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      company: 'Digital Dynamics',
      email: 'sarah.w@digitaldynamics.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      lastPurchase: 'Mar 25, 2024',
      totalSpent: '$8,920',
    },
    {
      id: '3',
      name: 'Michael Brown',
      company: 'Innovate Labs',
      email: 'm.brown@innovatelabs.com',
      phone: '+1 (555) 345-6789',
      status: 'inactive',
      lastPurchase: 'Feb 15, 2024',
      totalSpent: '$4,250',
    },
    {
      id: '4',
      name: 'Lisa Anderson',
      company: 'Creative Corp',
      email: 'l.anderson@creativecorp.com',
      phone: '+1 (555) 456-7890',
      status: 'pending',
      lastPurchase: 'Mar 20, 2024',
      totalSpent: '$12,300',
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeading heading={'Customers'} />

      <div className="min-h-[calc(100vh_-_160px)] w-full">
        <div className="flex items-center justify-between gap-4 overflow-x-auto rounded-t-lg bg-white px-5 py-[17px]">
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant={'outline'}
              className="bg-light-theme ring-0"
            >
              All Customers
            </Button>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={'outline-general'}
                  >
                    <CalendarCheck />
                    {date ? format(date, 'PP') : <span>Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="!w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-xs font-medium text-gray-700">To</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={'outline-general'}
                  >
                    <CalendarCheck />
                    {mainDate ? format(mainDate, 'PPP') : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="!w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={mainDate}
                    onSelect={setMainDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div id="search-table"></div>
            <Select>
              <SelectTrigger className="py-2 text-xs text-black shadow-sm ring-1 ring-gray-300">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <div className="space-y-1.5">
                  <SelectItem className="text-xs/tight" value="all">All</SelectItem>
                  <SelectItem className="text-xs/tight" value="active">Active</SelectItem>
                  <SelectItem className="text-xs/tight" value="inactive">Inactive</SelectItem>
                  <SelectItem className="text-xs/tight" value="pending">Pending</SelectItem>
                </div>
              </SelectContent>
            </Select>
            <Link href="/crm/customers/new">
              <Button variant={'black'}>
                <Plus />
                Add Customer
              </Button>
            </Link>
          </div>
        </div>

        <DataTable columns={columns} data={data} filterField="name" />
      </div>
    </div>
  )
}

export default Customers
