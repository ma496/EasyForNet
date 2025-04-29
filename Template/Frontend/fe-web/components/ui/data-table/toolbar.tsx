import { useState, useEffect, ReactNode } from 'react';
import { useDataTable } from './context';
import IconSearch from '@/components/icon/icon-search';
import { cn } from '@/lib/utils';

interface DataTableToolbarProps<TData> {
  searchPlaceholder?: string;
  title?: string | ReactNode;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  searchPlaceholder = 'Search...',
  title,
  children
}: DataTableToolbarProps<TData>) {
  const { columnFilters, setColumnFilters } = useDataTable<TData>();
  const [searchValue, setSearchValue] = useState('');

  // Initialize search value from existing filter
  useEffect(() => {
    const globalFilter = columnFilters.find(filter => filter.id === 'global');
    if (globalFilter) {
      setSearchValue(globalFilter.value as string);
    }
  }, []);

  const handleGlobalFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    setColumnFilters(prev => {
      // Remove existing global filter if any
      const filtered = prev.filter(filter => filter.id !== 'global');

      // Add new global filter if search term exists
      if (value) {
        return [
          ...filtered,
          {
            id: 'global',
            value: value,
          },
        ];
      }

      return filtered;
    });
  };

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
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleGlobalFilter}
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
