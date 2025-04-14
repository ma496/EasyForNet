'use client';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTableProvider,
  DataTable,
  DataTableToolbar,
  DataTablePagination,
  CheckboxCell,
  CheckboxHeader,
} from '../../../../../components/ui/data-table';

// Define the data type for our table
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
  const columns = [
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
      sortingFn: 'basic',
    }),
    columnHelper.accessor('firstName', {
      header: 'First name',
      cell: info => info.getValue(),
      sortingFn: 'basic',
    }),
    columnHelper.accessor('lastName', {
      header: 'Last name',
      cell: info => info.getValue(),
      sortingFn: 'basic',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
      sortingFn: 'basic',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone No.',
      cell: info => info.getValue(),
      sortingFn: 'basic',
    }),
  ];

  // Custom page size options
  const customPageSizeOptions = [5, 10, 25, 50, 100, 200];

  return (
    <div className="panel">
      <h2 className="text-xl font-bold mb-5">Data Table Example</h2>

      <DataTableProvider
        data={userData}
        columns={columns}
        initialPageSize={10}
        pageSizeOptions={customPageSizeOptions}
        enableRowSelection={enableSelection}
      >
        <DataTableToolbar globalFilterPlaceholder="Search...">
          {/* Additional toolbar items could go here */}
        </DataTableToolbar>

        <DataTable />

        <DataTablePagination siblingCount={1} />
      </DataTableProvider>
    </div>
  );
}
