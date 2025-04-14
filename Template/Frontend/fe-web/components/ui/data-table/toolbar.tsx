import { useState, useEffect } from 'react';
import { useDataTable } from './context';

interface DataTableToolbarProps<TData> {
  globalFilterPlaceholder?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  globalFilterPlaceholder = 'Search...',
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
    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
      <div className="flex items-center">
        <input
          type="text"
          className="form-input w-auto max-w-xs rounded-md border-white-light py-2 px-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:border-primary focus:ring-transparent dark:border-[#17263c] dark:bg-[#121e32] dark:text-white-dark dark:placeholder:text-gray-500 dark:focus:border-primary"
          placeholder={globalFilterPlaceholder}
          value={searchValue}
          onChange={handleGlobalFilter}
        />
      </div>

      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
