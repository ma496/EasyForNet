'use client'

import { getTranslation } from '@/i18n'
import { Select } from '@/components/ui/form/select'
import { useRoleListQuery } from '@/store/api/identity/roles/roles-api'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface UserFilters {
  isActive: string
  roleId: string
}

interface UserFilterPanelProps {
  filters: UserFilters
  onChange: (filters: UserFilters) => void
  onSearch: () => void
  onClear: () => void
}

export const UserFilterPanel = ({ filters, onChange, onSearch, onClear }: UserFilterPanelProps) => {
  const { t } = getTranslation()

  const { data: rolesData } = useRoleListQuery({ all: true })

  const activeFilterOptions = [
    { label: t('table.filter.all') || 'All', value: '' },
    { label: t('table.filter.active') || 'Active', value: 'true' },
    { label: t('table.filter.inactive') || 'Inactive', value: 'false' },
  ]

  const roleOptions = [
    { label: t('table.filter.allRoles') || 'All Roles', value: '' },
    ...(rolesData?.items.map((role) => ({
      label: role.name,
      value: role.id,
    })) || []),
  ]

  const activeFiltersCount = [filters.isActive, filters.roleId].filter(Boolean).length

  return (
    <div className="mb-4 panel-2">
      {/* Filters Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Active Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="isActive"
            className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {t('table.filter.activeStatus') || 'Active Status'}
          </label>
          <Select
            name="isActive"
            id="isActive"
            options={activeFilterOptions}
            value={filters.isActive}
            onChange={(_, value) => onChange({ ...filters, isActive: value })}
            placeholder={t('table.filter.all') || 'All'}
            searchable={false}
            clearable={false}
            size="sm"
          />
        </div>

        {/* Role Filter */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="roleId"
            className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {t('table.filter.role') || 'Role'}
          </label>
          <Select
            name="roleId"
            id="roleId"
            options={roleOptions}
            value={filters.roleId}
            onChange={(_, value) => onChange({ ...filters, roleId: value })}
            placeholder={t('table.filter.selectRole') || 'Select Role'}
            searchable={true}
            clearable={true}
            size="sm"
          />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          onClick={onSearch}
          icon={<Search className="h-4 w-4" />}
          size="sm"
        >
          {t('table.filter.search') || 'Search'}
        </Button>
        <Button
          variant="secondary"
          onClick={onClear}
          disabled={activeFiltersCount === 0}
          icon={<X className="h-4 w-4" />}
          size="sm"
        >
          {t('table.filter.clear') || 'Clear'}
        </Button>
      </div>
    </div>
  )
}
