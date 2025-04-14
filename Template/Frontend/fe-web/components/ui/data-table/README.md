# Data Table Component

A responsive, customizable data table component built with [@tanstack/react-table](https://tanstack.com/table/v8).

## Features

- Sorting
- Pagination
- Global search/filtering
- Row selection
- Dark mode support
- Responsive design

## Basic Usage

```tsx
import { ColumnDef } from '@tanstack/react-table';
import {
  DataTableProvider,
  DataTable,
  DataTableToolbar,
  DataTablePagination,
} from '@/components/ui/data-table';

// Define your data type
interface User {
  id: number;
  name: string;
  email: string;
}

// Sample data
const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Define your columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

export default function MyDataTable() {
  return (
    <DataTableProvider
      data={data}
      columns={columns}
      initialPageSize={10}
    >
      <DataTableToolbar globalFilterPlaceholder="Search users..." />
      <DataTable />
      <DataTablePagination />
    </DataTableProvider>
  );
}
```

## Components

### `DataTableProvider`

The provider component that manages the state of the data table.

Props:
- `data`: The data to display in the table
- `columns`: The columns configuration
- `initialPageSize`: Initial number of rows per page (default: 10)
- `initialPageIndex`: Initial page index (default: 0)
- `children`: The components that will consume the data table context

### `DataTable`

The main table component that renders the table.

Props:
- `className`: Optional CSS class to apply to the table

### `DataTableToolbar`

A toolbar component that provides search functionality and can contain additional actions.

Props:
- `globalFilterPlaceholder`: Placeholder text for the search input
- `children`: Additional toolbar elements

### `DataTablePagination`

A pagination component for navigating through pages of data.

Props:
- `className`: Optional CSS class to apply to the pagination component

### `CheckboxCell` and `CheckboxHeader`

Utility components for adding row selection functionality to the table.

## Advanced Usage with Selection

```tsx
import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTableProvider,
  DataTable,
  DataTableToolbar,
  DataTablePagination,
  CheckboxCell,
  CheckboxHeader,
} from '@/components/ui/data-table';

// Define your data and column helper
const data = [...]; // Your data
const columnHelper = createColumnHelper<User>();

// Define columns with selection checkbox
const columns = [
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
  }),
  // Your other columns...
];

// Render the table
return (
  <DataTableProvider data={data} columns={columns}>
    <DataTableToolbar />
    <DataTable />
    <DataTablePagination />
  </DataTableProvider>
);
``` 
