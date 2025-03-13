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

// Since we're missing the Avatar component, let's create a simpler version using just an image and initials
const UserAvatar = ({ image, initials }: { image: string; initials: string }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
    {image ? (
      <img src={image} alt="avatar" className="h-full w-full rounded-full" />
    ) : (
      <span className="text-sm font-medium">{initials}</span>
    )}
  </div>
)

interface IUser {
  id: string
  name: string
  avatar: {
    image: string
    initials: string
  }
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
}

const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <UserAvatar image={user.avatar.image} initials={user.avatar.initials} />
          <span className="font-medium">{user.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'department',
    header: 'Department',
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
    accessorKey: 'joinDate',
    header: 'Join Date',
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
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const Users = () => {
  const [date, setDate] = useState<Date>()
  const [mainDate, setMainDate] = useState<Date>()

  const data: IUser[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: {
        image: '/images/avatar.svg',
        initials: 'JD',
      },
      email: 'john.doe@example.com',
      role: 'Administrator',
      department: 'IT',
      status: 'active',
      joinDate: 'Mar 31, 2024',
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: {
        image: '/images/avatar-two.svg',
        initials: 'JS',
      },
      email: 'jane.smith@example.com',
      role: 'Manager',
      department: 'Sales',
      status: 'active',
      joinDate: 'Mar 15, 2024',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      avatar: {
        image: '/images/avatar-three.svg',
        initials: 'RJ',
      },
      email: 'robert.j@example.com',
      role: 'Developer',
      department: 'Engineering',
      status: 'inactive',
      joinDate: 'Feb 28, 2024',
    },
    {
      id: '4',
      name: 'Emily Davis',
      avatar: {
        image: '/images/avatar-four.svg',
        initials: 'ED',
      },
      email: 'emily.d@example.com',
      role: 'Designer',
      department: 'Design',
      status: 'pending',
      joinDate: 'Mar 1, 2024',
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeading heading={'Users'} />

      <div className="min-h-[calc(100vh_-_160px)] w-full">
        <div className="flex items-center justify-between gap-4 overflow-x-auto rounded-t-lg bg-white px-5 py-[17px]">
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant={'outline'}
              className="bg-light-theme ring-0"
            >
              All Users
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
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <div className="space-y-1.5">
                  <SelectItem className="text-xs/tight" value="all">All</SelectItem>
                  <SelectItem className="text-xs/tight" value="admin">Administrator</SelectItem>
                  <SelectItem className="text-xs/tight" value="manager">Manager</SelectItem>
                  <SelectItem className="text-xs/tight" value="user">User</SelectItem>
                </div>
              </SelectContent>
            </Select>
            <Link href="/users/new">
              <Button variant={'black'}>
                <Plus />
                Add User
              </Button>
            </Link>
          </div>
        </div>

        <DataTable columns={columns} data={data} filterField="name" />
      </div>
    </div>
  )
}

export default Users
