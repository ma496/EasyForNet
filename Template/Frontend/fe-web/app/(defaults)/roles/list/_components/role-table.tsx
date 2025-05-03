'use client';
import { createColumnHelper, SortingState, PaginationState } from '@tanstack/react-table';
import { DataTableProvider } from '@/components/ui/data-table/context';
import { DataTableToolbar } from '@/components/ui/data-table/toolbar';
import { DataTablePagination } from '@/components/ui/data-table/pagination';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';
import { useRoleListQuery, useLazyRoleListQuery, useRoleDeleteMutation } from '@/store/api/roles/roles-api';
import { SortDirection } from '@/store/api/base/sort-direction';
import { RoleListDto } from '@/store/api/roles/dto/role-list-response';
import { Download, Loader2, Trash2, Plus, Pencil, Shield } from 'lucide-react';
import { getTranslation } from '@/i18n';
import * as XLSX from 'xlsx';
import Dropdown from '@/components/dropdown';
import { useAppSelector } from '@/store/hooks';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { Allow } from '@/allow';
import { isAllowed } from '@/store/slices/authSlice';

export const RoleTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { t } = getTranslation();
  const isRTL = useAppSelector(state => state.theme.rtlClass) === 'rtl';

  const { data: roleListResponse, isFetching } = useRoleListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortField: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
    search: globalFilter || undefined,
  });

  const [fetchRoles] = useLazyRoleListQuery();
  const [deleteRole] = useRoleDeleteMutation();

  const authState = useAppSelector(state => state.auth);
  const canCreate = isAllowed(authState, [Allow.Role_Create]);
  const canUpdate = isAllowed(authState, [Allow.Role_Update]);
  const canDelete = isAllowed(authState, [Allow.Role_Delete]);
  const canChangePermissions = isAllowed(authState, [Allow.Role_ChangePermissions]);

  type ExportFormat = 'excel' | 'csv';

  const exportData = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true);
    try {
      let dataToExport;
      if (all) {
        const response = await fetchRoles({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortField: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
          search: globalFilter || undefined,
          all: true,
        }).unwrap();
        dataToExport = response.items;
      } else {
        dataToExport = roleListResponse?.items || [];
      }

      const exportData = dataToExport.map(role => ({
        Name: role.name,
        Description: role.description,
        'User Count': role.users.length
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      if (format === 'excel') {
        XLSX.utils.book_append_sheet(wb, ws, 'Roles');
        XLSX.writeFile(wb, 'roles.xlsx');
      } else {
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'roles.csv';
        link.click();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    const result = await Swal.fire({
      title: t('delete_role_title'),
      text: t('delete_role_confirmation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete_confirm'),
      cancelButtonText: t('delete_cancel')
    });

    if (result.isConfirmed) {
      const response = await deleteRole({ id: roleId }).unwrap();
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('success_roleDeleted'),
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: t('error'),
          text: response.message,
        });
      }
    }
  };

  const columnHelper = createColumnHelper<RoleListDto>();
  const columns = [
    columnHelper.accessor('name', {
      header: t('table_roles_name'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: t('table_roles_description'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('users', {
      header: t('table_roles_userCount'),
      cell: info => info.getValue().length.toString(),
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table_actions'),
      cell: info => (
        <div className="flex items-center gap-2 justify-end">
          {canUpdate && (
            <Link
              href={`/roles/update/${info.row.original.id}`}
              className="btn btn-secondary btn-sm"
            >
              <Pencil className="h-3 w-3" />
            </Link>
          )}
          {canDelete && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(info.row.original.id)}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
          {canChangePermissions && (
            <Link
              href={`/roles/change-permissions/${info.row.original.id}`}
              className="btn btn-primary btn-sm"
            >
              <Shield className="h-3 w-3" />
            </Link>
          )}
        </div>
      ),
    }),
  ];

  return (
    <div className="panel mt-6 min-w-[300px] sm:min-w-[600px] md:min-w-[750px] lg:min-w-[850px]">
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
        isFetching={isFetching}
      >
        <DataTableToolbar title={t('page_roles_title')}>
          {canCreate && (
            <Link href="/roles/create" className="btn btn-primary flex items-center gap-2">
              <Plus size={16} />
              <span>{t('table_createLink')}</span>
            </Link>
          )}
          <div className='dropdown'>
            <Dropdown
              placement={`${isRTL ? 'bottom-start' : 'bottom-end'}`}
              btnClassName="btn btn-primary dropdown-toggle"
              isDisabled={isExporting}
              button={
                <div className='flex items-center gap-2'>
                  {isExporting ? <Loader2 className='animate-spin' size={16} /> : <Download size={16} />}
                  <span className=''>{t('table_export')}</span>
                </div>
              }
            >
              <ul className='mt-10'>
                <li className="px-4 py-2 font-semibold text-sm text-gray-500 dark:text-gray-600">{t('table_export_excel')}</li>
                <li>
                  <div
                    role="menuitem"
                    className="w-full px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30] cursor-pointer"
                    onClick={() => exportData('excel', false)}
                  >
                    {t('table_export_current_page')}
                  </div>
                </li>
                <li>
                  <div
                    role="menuitem"
                    className="w-full px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30] cursor-pointer"
                    onClick={() => exportData('excel', true)}
                  >
                    {t('table_export_all_records')}
                  </div>
                </li>
                <li className="px-4 py-2 font-semibold text-sm text-gray-500 dark:text-gray-600">{t('table_export_csv')}</li>
                <li>
                  <div
                    role="menuitem"
                    className="w-full px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30] cursor-pointer"
                    onClick={() => exportData('csv', false)}
                  >
                    {t('table_export_current_page')}
                  </div>
                </li>
                <li>
                  <div
                    role="menuitem"
                    className="w-full px-4 py-2 hover:bg-white-light dark:hover:bg-[#131E30] cursor-pointer"
                    onClick={() => exportData('csv', true)}
                  >
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
  );
};
