'use client';
import { useState } from 'react';
import { useUserListQuery, useLazyUserListQuery, useUserDeleteMutation } from '@/store/api/users/users-api';
import { SortDirection } from '@/store/api/base/sort-direction';
import { UserListDto } from '@/store/api/users/dto/user-list-response';
import { Download, Loader2, Trash2, Plus, Pencil } from 'lucide-react';
import { getTranslation } from '@/i18n';
import * as XLSX from 'xlsx';
import Dropdown from '@/components/dropdown';
import { useAppSelector } from '@/store/hooks';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { isAllowed } from '@/store/slices/authSlice';
import { Allow } from '@/allow';
import { createColumnHelper, SortingState, PaginationState } from '@tanstack/react-table';
import { DataTableProvider } from '@/components/ui/data-table/context';
import { DataTableToolbar } from '@/components/ui/data-table/toolbar';
import { DataTablePagination } from '@/components/ui/data-table/pagination';
import { DataTable } from '@/components/ui/data-table';

export const UserTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { t } = getTranslation();

  const isRTL = useAppSelector(state => state.theme.rtlClass) === 'rtl';

  const { data: userListResponse, isFetching } = useUserListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortField: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
    search: globalFilter,
  });

  const [fetchUsers] = useLazyUserListQuery();
  const [deleteUser] = useUserDeleteMutation();

  const authState = useAppSelector(state => state.auth);
  const canCreate = isAllowed(authState, [Allow.User_Create]);
  const canUpdate = isAllowed(authState, [Allow.User_Update]);
  const canDelete = isAllowed(authState, [Allow.User_Delete]);

  type ExportFormat = 'excel' | 'csv';

  const exportData = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true);
    try {
      let dataToExport;
      if (all) {
        const response = await fetchUsers({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          sortField: sorting[0]?.id,
          sortDirection: sorting[0]?.desc ? SortDirection.Desc : SortDirection.Asc,
          search: globalFilter,
          all: true,
        }).unwrap();
        dataToExport = response.items;
      } else {
        dataToExport = userListResponse?.items || [];
      }

      const exportData = dataToExport.map(user => ({
        Username: user.username,
        Email: user.email,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Roles: user.roles.map(role => role.name).join(', ')
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      if (format === 'excel') {
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'users.xlsx');
      } else {
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'users.csv';
        link.click();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: t('delete_user_title'),
      text: t('delete_user_confirmation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete_confirm'),
      cancelButtonText: t('delete_cancel')
    });

    if (result.isConfirmed) {
      const response = await deleteUser({ id: userId }).unwrap();
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('success_userDeleted'),
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

  const columnHelper = createColumnHelper<UserListDto>();
  const columns = [
    columnHelper.accessor('usernameNormalized', {
      header: t('table_users_userName'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('emailNormalized', {
      header: t('table_users_email'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
      header: t('table_users_firstName'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: t('table_users_lastName'),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('roles', {
      header: t('table_users_roles'),
      cell: info => info.getValue().map(role => role.name).join(', '),
      enableSorting: false,
    }),
    columnHelper.accessor('isActive', {
      header: t('table_users_isActive'),
      cell: info => info.getValue()
        ? <span className='bg-green-500 text-white px-2 py-1 rounded-md text-xs'>Yes</span>
        : <span className='bg-red-500 text-white px-2 py-1 rounded-md text-xs'>No</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table_actions'),
      cell: info => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Link
              href={`/users/update/${info.row.original.id}`}
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
        </div>
      ),
    }),
  ];

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
        isFetching={isFetching}
      >
        <DataTableToolbar title={t('page_users_title')}>
          {canCreate && (
            <Link href="/users/create" className="btn btn-primary flex items-center gap-2">
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
