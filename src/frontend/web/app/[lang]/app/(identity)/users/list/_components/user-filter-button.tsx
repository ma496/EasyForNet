'use client'

import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTranslation } from '@/i18n'

interface UserFilterButtonProps {
  isOpen: boolean
  onToggle: () => void
  activeFiltersCount?: number
}

export const UserFilterButton = ({ isOpen, onToggle, activeFiltersCount = 0 }: UserFilterButtonProps) => {
  const { t } = getTranslation()

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-[#1b2e4b] dark:text-gray-200 dark:hover:bg-gray-700',
        isOpen && 'bg-gray-50 dark:bg-gray-700'
      )}
    >
      <Filter size={16} />
      <span className="hidden sm:inline">{t('filter.button') || 'Filters'}</span>
      {activeFiltersCount > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {activeFiltersCount}
        </span>
      )}
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  )
}
