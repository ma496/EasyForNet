import {
  flexRender,
} from '@tanstack/react-table';
import { useDataTable } from './context';
import { SortIcon } from './sort-icon';
import { Loading } from '../loading';
import { getTranslation } from '@/i18n';

interface DataTableProps<TData> {
  className?: string;
}

export function DataTable<TData>({ className = '' }: DataTableProps<TData>) {
  const {
    columns,
    table,
    isFetching
  } = useDataTable<TData>();
  const { t } = getTranslation()

  return (
    <div className="relative overflow-x-auto">
      <table className={`w-full table-auto ${className}`}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="p-4 font-semibold text-left first:rounded-tl-md last:rounded-tr-md"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex items-center group ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <SortIcon isSorted={header.column.getIsSorted()} />}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isFetching ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6">
                <Loading size='lg' />
              </td>
            </tr>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`border-b border-white-light/40 dark:border-[#191e3a] hover:bg-white-light/20 dark:hover:bg-[#1a2941]/40 ${row.getIsSelected() ? 'bg-primary/10 dark:bg-primary/20' : ''
                  }`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-6">
                {t('table_no_records_found')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
