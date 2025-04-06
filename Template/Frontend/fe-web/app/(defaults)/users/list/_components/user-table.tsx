'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useUserListQuery, useLazyUserListQuery, useUserDeleteMutation } from '@/store/api/users/users-api';
import { SortDirection } from '@/store/api/base/sort-direction';
import { UserListDto } from '@/store/api/users/dto/user-list-response';
import { Search, Download, Loader2, Trash2, Plus } from 'lucide-react';
import { getTranslation } from '@/i18n';
import * as XLSX from 'xlsx';
import Dropdown from '@/components/dropdown';
import { useAppSelector } from '@/store/hooks';
import Swal from 'sweetalert2';
import Link from 'next/link';

export const UserTable = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<UserListDto>>({
    columnAccessor: '',
    direction: 'asc',
  });
  const { t } = getTranslation();

  const isRTL = useAppSelector(state => state.theme.rtlClass) === 'rtl';

  const { data: userListResponse, isLoading } = useUserListQuery({
    page,
    pageSize,
    sortField: sortStatus.columnAccessor,
    sortDirection: sortStatus.direction === 'asc' ? SortDirection.Asc : SortDirection.Desc,
    search: search || undefined,
  });

  const [fetchUsers, { isFetching: isFetchingUsers }] = useLazyUserListQuery();
  const [deleteUser] = useUserDeleteMutation();

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

  type ExportFormat = 'excel' | 'csv';

  const exportData = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true);
    try {
      let dataToExport;
      if (all) {
        const response = await fetchUsers({
          page,
          pageSize,
          sortField: sortStatus.columnAccessor,
          sortDirection: sortStatus.direction === 'asc' ? SortDirection.Asc : SortDirection.Desc,
          search: search || undefined,
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
        await fetchUsers({
          page,
          pageSize,
          sortField: sortStatus.columnAccessor,
          sortDirection: sortStatus.direction === 'asc' ? SortDirection.Asc : SortDirection.Desc,
          search: search || undefined,
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

  return (
    <div className="panel mt-6">
      <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 className="text-lg font-semibold dark:text-white-light">{t('page_users_title')}</h5>
        <div className="flex items-center gap-4 ltr:ml-auto rtl:mr-auto">
          <div className="relative">
            <input
              type="text"
              className="form-input w-auto ltr:pl-9 rtl:pr-9"
              placeholder={t('search...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300 dark:text-gray-600 ltr:left-2 rtl:right-2" />
          </div>
          <Link href="/users/create" className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span>{t('table_createLink')}</span>
          </Link>
          <div className='dropdown'>
            <Dropdown
              placement={`${isRTL ? 'bottom-start' : 'bottom-end'}`}
              btnClassName="btn btn-primary dropdown-toggle"
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
        </div>
      </div>
      <div className="datatables">
        <DataTable<UserListDto>
          className="table-hover whitespace-nowrap"
          records={userListResponse?.items || []}
          columns={[
            { accessor: 'username', sortable: true, title: t('page_users_userName') },
            { accessor: 'email', sortable: true, title: t('page_users_email') },
            { accessor: 'firstName', sortable: true, title: t('page_users_firstName') },
            { accessor: 'lastName', sortable: true, title: t('page_users_lastName') },
            {
              accessor: 'roles',
              title: t('page_users_roles'),
              render: (record) => record.roles.map(role => role.name).join(', '),
              sortable: false
            },
            {
              accessor: 'actions',
              title: t('table_actions'),
              sortable: false,
              render: (record) => (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ),
            },
          ]}
          highlightOnHover
          totalRecords={userListResponse?.total || 0}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          minHeight={200}
          paginationText={({ from, to, totalRecords }) => t('table_pagination_showing_entries', { from, to, totalRecords })}
          fetching={isLoading || isFetchingUsers}
          noRecordsText={t('table_no_records_found')}
          recordsPerPageLabel={''}
        />
      </div>
    </div>
  );
};
