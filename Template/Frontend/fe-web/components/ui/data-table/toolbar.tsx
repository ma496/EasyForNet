import { ReactNode } from 'react';
import IconSearch from '@/components/icon/icon-search';
import { cn } from '@/lib/utils';
import { getTranslation } from '@/i18n';
import { useDataTable } from './context';

interface DataTableToolbarProps<TData> {
  searchPlaceholder?: string;
  title?: string | ReactNode;
  children?: React.ReactNode;
}


export function DataTableToolbar<TData>({
  title,
  children,
}: DataTableToolbarProps<TData>) {
  const { t } = getTranslation()
  const { table } = useDataTable<TData>()

  return (
    <div className="flex flex-col gap-4 mb-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Title on left side */}
      {title && (
        <div className="text-xl font-semibold">
          {title}
        </div>
      )}

      {/* Right side controls - stack on mobile, row on tablet+ */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-4 w-full",
        title ? "sm:justify-end sm:w-auto" : "sm:justify-between"
      )}>
        {/* Search with icon */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="form-input w-full sm:w-auto max-w-xs rounded-md border-white-light py-2 pl-9 pr-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:border-primary focus:ring-transparent dark:border-[#17263c] dark:bg-[#121e32] dark:text-white-dark dark:placeholder:text-gray-500 dark:focus:border-primary"
            placeholder={t('table_search_placeholder')}
            value={table.getState().globalFilter}
            onChange={e => table.setGlobalFilter(String(e.target.value))}
          />
        </div>

        {/* Action buttons */}
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
