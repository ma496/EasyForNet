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
import Link from 'next/link'
import { Allow } from '@/allow'
import { createColumnHelper, SortingState, PaginationState, ColumnDef } from '@tanstack/react-table'
import { DataTableProvider } from '@/components/ui/data-table/context'
import { DataTableToolbar } from '@/components/ui/data-table/toolbar'
import { DataTablePagination } from '@/components/ui/data-table/pagination'
import { DataTable } from '@/components/ui/data-table'
import { confirmDeleteAlert, errorAlert } from '@/lib/utils'
import { UserFilterPanel, UserFilters } from './user-filter-panel'
import { UserFilterButton } from './user-filter-button'

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
      title: t('delete_user_title'),
      text: t('delete_user_confirmation'),
    })

    if (result.isConfirmed) {
      const response = await deleteUser({ id: userId })
      if (response.data?.success) {
        successToast.fire({
          title: t('success_userDeleted'),
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
      header: t('table_users_userName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('emailNormalized', {
      header: t('table_users_email'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
      header: t('table_users_firstName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: t('table_users_lastName'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('roles', {
      header: t('table_users_roles'),
      cell: (info) =>
        info
          .getValue()
          .map((role: UserRoleDto) => role.name)
          .join(', '),
      enableSorting: false,
    }),
    columnHelper.accessor('isActive', {
      header: t('table_users_isActive'),
      cell: (info) =>
        info.getValue() ? <span className="rounded-md bg-green-500 px-2 py-1 text-xs text-white">Yes</span> : <span className="rounded-md bg-red-500 px-2 py-1 text-xs text-white">No</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table_actions'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Link href={`/app/users/update/${info.row.original.id}`} className="btn btn-secondary btn-sm">
              <Pencil className="h-3 w-3" />
            </Link>
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
        <DataTableToolbar title={t('page_users_title')}>
          {/* Filter Button in toolbar */}
          <UserFilterButton
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            activeFiltersCount={activeFiltersCount}
          />

          {canCreate && (
            <Link href="/app/users/create" className="btn flex items-center gap-2 btn-primary">
              <Plus size={16} />
              <span className="hidden sm:inline">{t('table_createLink')}</span>
            </Link>
          )}
          <div className="dropdown">
            <Dropdown
              placement={`${isRTL ? 'bottom-start' : 'bottom-end'}`}
              btnClassName="btn btn-primary dropdown-toggle"
              isDisabled={isExporting || isGettingUsers || !userListResponse?.total}
              button={
                <div className="flex items-center gap-2">
                  {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  <span className="hidden sm:inline">{t('table_export')}</span>
                </div>
              }
            >
              <ul className="mt-10">
                <li className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-600">{t('table_export_excel')}</li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('excel', false)}>
                    {t('table_export_current_page')}
                  </div>
                </li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('excel', true)}>
                    {t('table_export_all_records')}
                  </div>
                </li>
                <li className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-600">{t('table_export_csv')}</li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('csv', false)}>
                    {t('table_export_current_page')}
                  </div>
                </li>
                <li>
                  <div role="menuitem" className="w-full cursor-pointer px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30]" onClick={() => handleExport('csv', true)}>
                    {t('table_export_all_records')}
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
