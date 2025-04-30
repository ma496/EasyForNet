'use client';

import { ColumnDef, createColumnHelper, PaginationState, SortingState } from '@tanstack/react-table';
import {
  DataTableProvider,
  DataTable,
  DataTableToolbar,
  DataTablePagination,
  CheckboxCell,
  CheckboxHeader,
} from '@/components/ui/data-table';
import Link from 'next/link';
import { Plus, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Generate a lot of dummy data for pagination testing
function generateUsers(count: number): User[] {
  const baseUsers = [
    { id: 1, firstName: 'Caroline', lastName: 'Jensen', email: 'carolinejensen@zidant.com', phone: '+1 (821) 447-3782' },
    { id: 2, firstName: 'Celeste', lastName: 'Grant', email: 'celestegrant@polarax.com', phone: '+1 (838) 515-3408' },
    { id: 3, firstName: 'Tillman', lastName: 'Forbes', email: 'tillmanforbes@manglo.com', phone: '+1 (969) 496-2892' },
    { id: 4, firstName: 'Daisy', lastName: 'Whitley', email: 'daisywhitley@applideck.com', phone: '+1 (861) 564-2877' },
    { id: 5, firstName: 'Weber', lastName: 'Bowman', email: 'weberbowman@volax.com', phone: '+1 (962) 466-3483' },
    { id: 6, firstName: 'Buckley', lastName: 'Townsend', email: 'buckleytownsend@orbaxter.com', phone: '+1 (884) 595-2643' },
    { id: 7, firstName: 'Latoya', lastName: 'Bradshaw', email: 'latoyabradshaw@opportech.com', phone: '+1 (906) 474-3155' },
    { id: 8, firstName: 'Kate', lastName: 'Lindsay', email: 'katelindsay@gorganic.com', phone: '+1 (930) 546-2952' },
    { id: 9, firstName: 'Marva', lastName: 'Sandoval', email: 'marvasandoval@avit.com', phone: '+1 (927) 566-3600' },
    { id: 10, firstName: 'Decker', lastName: 'Russell', email: 'deckerrussell@quilch.com', phone: '+1 (846) 535-3283' }
  ];

  // For a large number of users, we'll repeat the base users with different IDs
  const result: User[] = [];
  for (let i = 0; i < count; i++) {
    const baseUser = baseUsers[i % baseUsers.length];
    result.push({
      id: i + 1,
      firstName: baseUser.firstName,
      lastName: baseUser.lastName,
      email: `user${i + 1}@example.com`,
      phone: baseUser.phone
    });
  }
  return result;
}

// Generate 200 users (20 pages with 10 per page)
const userData = generateUsers(200);

export function DataTableExample() {
  const enableSelection = true;
  const columnHelper = createColumnHelper<User>();

  // Define columns - conditionally include checkbox column if selection is enabled
  const columns: ColumnDef<User, any>[] = [
    // Only include checkbox column if selection is enabled
    ...(enableSelection ? [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <CheckboxHeader
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={() => table.toggleAllRowsSelected()}
          />
        ),
        cell: ({ row }) => <CheckboxCell row={row} />,
        size: 50,
      })
    ] : []),
    columnHelper.accessor('id', {
      header: 'Id',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
      header: 'First name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone No.',
      cell: info => info.getValue(),
    }),
  ];

  // Custom page size options
  const customPageSizeOptions = [5, 10, 25, 50, 100, 200];

  // Example of a React Element for the title
  const titleElement = (
    <div className="flex items-center gap-2">
      <span className="text-primary">👥</span>
      <span>Users Directory</span>
    </div>
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterData, setFilterData] = useState<User[]>([]);

  // do pagination
  useEffect(() => {
    const paginatedData = userData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
    setFilterData(paginatedData);
    console.log(`sorting, pagination`)
  }, [sorting, pagination]);


  return (
    <div className="panel">
      <DataTableProvider
        data={filterData}
        rowCount={userData.length}
        columns={columns as ColumnDef<unknown, any>[]}
        initialPageSize={10}
        pageSizeOptions={customPageSizeOptions}
        enableRowSelection={enableSelection}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
      >
        {/* Using a React Element as the title */}
        <DataTableToolbar title={titleElement}>
          {/* Additional toolbar items could go here */}
          <Link href="#" className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span>Add User</span>
          </Link>
          <Link href="#" className="btn btn-primary flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </Link>
        </DataTableToolbar>

        <DataTable />

        <DataTablePagination siblingCount={1} />
      </DataTableProvider>
    </div>
  );
}
