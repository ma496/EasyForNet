import { ReactNode, useId } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTranslation } from '@/i18n'
import { useDataTable } from './context'

interface DataTableToolbarProps {
  searchPlaceholder?: string
  title?: string | ReactNode
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({ title, children }: DataTableToolbarProps) {
  const { t } = getTranslation()
  const { table } = useDataTable<TData>()

  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title on left side */}
      {title && <div className="text-xl font-semibold">{title}</div>}

      {/* Right side controls - stack on mobile, row on tablet+ */}
      <div className={cn('flex w-full flex-wrap items-center justify-around gap-4 sm:justify-between', title ? 'sm:w-auto sm:justify-end' : 'sm:justify-between')}>
        {/* Search with icon */}
        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <Search size={16} className="text-gray-200 dark:text-gray-400" />
          </span>
          <input
            type="text"
            id={useId()}
            className="form-input w-full max-w-xs rounded-md border-white-light py-2 pr-3 pl-9 text-sm font-semibold text-black placeholder:text-gray-400 focus:border-primary focus:ring-transparent sm:w-auto dark:border-[#17263c] dark:bg-[#121e32] dark:text-white-dark dark:placeholder:text-gray-500 dark:focus:border-primary"
            placeholder={t('table.searchPlaceholder')}
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          />
        </div>

        {/* Action buttons */}
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  )
}
