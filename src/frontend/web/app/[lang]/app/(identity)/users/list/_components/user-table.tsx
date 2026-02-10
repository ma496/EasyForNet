'use client'
import { useState } from 'react'
import { useUserListQuery, useLazyUserListQuery, useUserDeleteMutation } from '@/store/api/identity/users/users-api'
import { SortDirection } from '@/store/api/base/sort-direction'
import { UserListDto, UserRoleDto } from '@/store/api/identity/users/users-dtos'
import { Download, Loader2, Trash2, Plus, Pencil } from 'lucide-react'
import { getTranslation } from '@/i18n'
import { ExportFormat, successToast, exportData, isAllowed } from '@/lib/utils'
import Dropdown from '@/components/dropdown'
import { useAppSelector } from '@/store/hooks'
// import Link from 'next/link'
import { LocalizedLink } from '@/components/localized-link'
import { Allow } from '@/allow'
import { createColumnHelper, SortingState, PaginationState, ColumnDef } from '@tanstack/react-table'
import { DataTableProvider } from '@/components/ui/data-table/context'
import { DataTableToolbar } from '@/components/ui/data-table/toolbar'
import { DataTablePagination } from '@/components/ui/data-table/pagination'
import { DataTable } from '@/components/ui/data-table'
import { confirmDeleteAlert, errorAlert } from '@/lib/utils'
import { UserFilterPanel, UserFilters } from './user-filter-panel'
import { UserFilterButton } from './user-filter-button'
import { Badge } from '@/components/ui/badge'

export const UserTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>({
    isActive: '',
    roleId: '',
  })
  const [pendingFilters, setPendingFilters] = useState<UserFilters>({
    isActive: '',
    roleId: '',
  })
  const { t } = getTranslation()

  const isRTL = useAppSelector((state) => state.theme.rtlClass) === 'rtl'

  const getIsActiveValue = (value: string): boolean | undefined => {
    if (value === 'true') return true
    if (value === 'false') return false
    return undefined
  }

  const activeFiltersCount = [appliedFilters.isActive, appliedFilters.roleId].filter(Boolean).length

  const {
    data: userListResponse,
    isFetching: isGettingUsers,
  } = useUserListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortField: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
    search: globalFilter,
    isActive: getIsActiveValue(appliedFilters.isActive),
    roleId: appliedFilters.roleId || undefined,
  })

  const [fetchUsers] = useLazyUserListQuery()
  const [deleteUser] = useUserDeleteMutation()

  const authState = useAppSelector((state) => state.auth)
  const canCreate = isAllowed(authState, [Allow.User_Create])
  const canUpdate = isAllowed(authState, [Allow.User_Update])
  const canDelete = isAllowed(authState, [Allow.User_Delete])

  const handleSearch = () => {
    setAppliedFilters(pendingFilters)
    setPagination({ ...pagination, pageIndex: 0 })
  }

  const handleClear = () => {
    const clearedFilters = {
      isActive: '',
      roleId: '',
    }
    setPendingFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    setPagination({ ...pagination, pageIndex: 0 })
  }

  const handleFilterChange = (newFilters: UserFilters) => {
    setPendingFilters(newFilters)
  }

  const handleExport = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true)
    try {
      let dataToExport: UserListDto[] = []
      if (all) {
        const response = await fetchUsers({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortField: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
          search: globalFilter,
          all: true,
          isActive: getIsActiveValue(appliedFilters.isActive),
          roleId: appliedFilters.roleId || undefined,
        })
        if (response.data) {
          dataToExport = response.data?.items
        }
      } else {
        dataToExport = userListResponse?.items || []
      }

      if (dataToExport.length === 0) return

      const rows = dataToExport.map((user) => ({
        Username: user.username,
        Email: user.email,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Roles: user.roles.map((role) => role.name).join(', '),
      }))
      exportData(format, rows, 'Users', 'users')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDelete = async (userId: string) => {
    const result = await confirmDeleteAlert({
      title: t('page.users.deleteTitle'),
      text: t('page.users.deleteConfirm'),
    })

    if (result.isConfirmed) {
      const response = await deleteUser({ id: userId })
      if (response.data?.success) {
        successToast.fire({
          title: t('page.users.deleteSuccess'),
        })
      } else if (response.data?.message) {
        await errorAlert({
          text: response.data?.message,
        })
      }
    }
  }

  const columnHelper = createColumnHelper<UserListDto>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<UserListDto, any>[] = [
    columnHelper.accessor('usernameNormalized', {
      header: t('table.columns.userName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('emailNormalized', {
      header: t('table.columns.email'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
      header: t('table.columns.firstName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: t('table.columns.lastName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('roles', {
      header: t('table.columns.roles'),
      cell: (info) =>
        info
          .getValue()
          .map((role: UserRoleDto) => role.name)
          .join(', '),
      enableSorting: false,
    }),
    columnHelper.accessor('isActive', {
      header: t('table.columns.isActive'),
      cell: (info) =>
        info.getValue() ? (
          <Badge variant="success">
            {t('table.filter.active')}
          </Badge>
        ) : (
          <Badge variant="danger">
            {t('table.filter.inactive')}
          </Badge>
        ),
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table.actions'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <LocalizedLink href={`/app/users/update/${info.row.original.id}`} className="btn btn-secondary btn-sm">
              <Pencil className="h-3 w-3" />
            </LocalizedLink>
          )}
          {canDelete && (
            <button type="button" className="btn cursor-pointer btn-danger btn-sm" onClick={() => handleDelete(info.row.original.id)}>
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ),
    }),
  ]

  return (
    <div className="panel mt-6">
      <DataTableProvider
        data={userListResponse?.items || []}
        rowCount={userListResponse?.total || 0}
        columns={columns}
        enableRowSelection={false}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isGettingUsers}
      >
        <DataTableToolbar title={t('page.users.title')}>
          {/* Filter Button in toolbar */}
          <UserFilterButton
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            activeFiltersCount={activeFiltersCount}
          />

          {canCreate && (
            <LocalizedLink href="/app/users/create" className="btn flex items-center gap-2 btn-primary">
              <Plus size={16} />
              <span className="hidden sm:inline">{t('table.createLink')}</span>
            </LocalizedLink>
          )}
          <div className="dropdown">
            <Dropdown
              placement={`${isRTL ? 'bottom-start' : 'bottom-end'}`}
              btnClassName="btn btn-primary dropdown-toggle"
              isDisabled={isExporting || isGettingUsers || !userListResponse?.total}
              button={
                <div className="flex items-center gap-2">
                  {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  <span className="hidden sm:inline">{t('table.export.button')}</span>
                </div>
              }
            >
              <ul className="mt-10">
                <li className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-600">{t('table.export.excel')}</li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('excel', false)}>
                    {t('table.export.currentPage')}
                  </div>
                </li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('excel', true)}>
                    {t('table.export.allRecords')}
                  </div>
                </li>
                <li className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-600">{t('table.export.csv')}</li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('csv', false)}>
                    {t('table.export.currentPage')}
                  </div>
                </li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('csv', true)}>
                    {t('table.export.allRecords')}
                  </div>
                </li>
              </ul>
            </Dropdown>
          </div>
        </DataTableToolbar>

        {/* Filter Panel - positioned between toolbar and table */}
        {filtersOpen && (
          <UserFilterPanel
            filters={pendingFilters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        )}
        <DataTable />

        <DataTablePagination siblingCount={1} />
      </DataTableProvider>
    </div>
  )
}
