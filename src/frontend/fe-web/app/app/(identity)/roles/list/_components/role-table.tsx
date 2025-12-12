'use client'
import { createColumnHelper, SortingState, PaginationState } from '@tanstack/react-table'
import { DataTableProvider } from '@/components/ui/data-table/context'
import { DataTableToolbar } from '@/components/ui/data-table/toolbar'
import { DataTablePagination } from '@/components/ui/data-table/pagination'
import { DataTable } from '@/components/ui/data-table'
import { useState } from 'react'
import { useRoleListQuery, useLazyRoleListQuery, useRoleDeleteMutation } from '@/store/api/identity/roles/roles-api'
import { SortDirection } from '@/store/api/base/sort-direction'
import { RoleListDto } from '@/store/api/identity/roles/dto/role-list-response'
import { Download, Loader2, Trash2, Plus, Pencil, Shield } from 'lucide-react'
import { getTranslation } from '@/i18n'
import { exportData, ExportFormat, isAllowed } from '@/lib/utils'
import Dropdown from '@/components/dropdown'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Allow } from '@/allow'
import { confirmDeleteAlert, errorAlert, successAlert } from '@/lib/utils'

export const RoleTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const { t } = getTranslation()
  const isRTL = useAppSelector((state) => state.theme.rtlClass) === 'rtl'

  const {
    data: roleListResponse,
    isFetching: isGettingRoles,
  } = useRoleListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortField: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
    search: globalFilter || undefined,
  })

  const [fetchRoles] = useLazyRoleListQuery()
  const [deleteRole] = useRoleDeleteMutation()

  const authState = useAppSelector((state) => state.auth)
  const canCreate = isAllowed(authState, [Allow.Role_Create])
  const canUpdate = isAllowed(authState, [Allow.Role_Update])
  const canDelete = isAllowed(authState, [Allow.Role_Delete])
  const canChangePermissions = isAllowed(authState, [Allow.Role_ChangePermissions])

  const handleExport = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true)
    try {
      let dataToExport: RoleListDto[] = []
      if (all) {
        const response = await fetchRoles({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortField: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
          search: globalFilter || undefined,
          all: true,
        })
        if (response.data) {
          dataToExport = response.data.items
        }
      } else {
        dataToExport = roleListResponse?.items || []
      }

      if (dataToExport.length === 0) return

      const rows = dataToExport.map((role) => ({
        Name: role.name,
        Description: role.description,
        Users: role.userCount,
      }))
      exportData(format, rows, 'Roles', 'roles')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDelete = async (roleId: string) => {
    const result = await confirmDeleteAlert({
      title: t('delete_role_title'),
      text: t('delete_role_confirmation'),
    })

    if (result.isConfirmed) {
      const response = await deleteRole({ id: roleId })
      if (response.data?.success) {
        await successAlert({
          text: t('success_roleDeleted'),
        })
      } else if (response.data?.message) {
        await errorAlert({
          text: response.data.message,
        })
      }
    }
  }

  const columnHelper = createColumnHelper<RoleListDto>()
  const columns = [
    columnHelper.accessor('name', {
      header: t('table_roles_name'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: t('table_roles_description'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userCount', {
      header: t('table_roles_userCount'),
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table_actions'),
      cell: (info) => (
        <div className="flex items-center justify-end gap-2">
          {canUpdate && (
            <Link href={`/app/roles/update/${info.row.original.id}`} className="btn btn-secondary btn-sm">
              <Pencil className="h-3 w-3" />
            </Link>
          )}
          {canDelete && (
            <button type="button" className="btn cursor-pointer btn-danger btn-sm" onClick={() => handleDelete(info.row.original.id)}>
              <Trash2 className="h-3 w-3" />
            </button>
          )}
          {canChangePermissions && (
            <Link href={`/app/roles/change-permissions/${info.row.original.id}`} className="btn btn-primary btn-sm">
              <Shield className="h-3 w-3" />
            </Link>
          )}
        </div>
      ),
    }),
  ]

  return (
    <div className="panel mt-6">
      <DataTableProvider
        data={roleListResponse?.items || []}
        rowCount={roleListResponse?.total || 0}
        columns={columns}
        enableRowSelection={false}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isGettingRoles}
      >
        <DataTableToolbar title={t('page_roles_title')}>
          {canCreate && (
            <Link href="/app/roles/create" className="btn flex items-center gap-2 btn-primary">
              <Plus size={16} />
              <span>{t('table_createLink')}</span>
            </Link>
          )}
          <div className="dropdown">
            <Dropdown
              placement={`${isRTL ? 'bottom-start' : 'bottom-end'}`}
              btnClassName="btn btn-primary dropdown-toggle"
              isDisabled={isExporting || isGettingRoles || !roleListResponse?.total}
              button={
                <div className="flex items-center gap-2">
                  {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  <span className="">{t('table_export')}</span>
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
        <DataTable />
        <DataTablePagination siblingCount={1} />
      </DataTableProvider>
    </div>
  )
}
