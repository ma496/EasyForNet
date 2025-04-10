'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useRoleListQuery, useLazyRoleListQuery, useRoleDeleteMutation } from '@/store/api/roles/roles-api';
import { SortDirection } from '@/store/api/base/sort-direction';
import { RoleListDto } from '@/store/api/roles/dto/role-list-response';
import { Search, Download, Loader2, Trash2, Plus, Pencil, Shield } from 'lucide-react';
import { getTranslation } from '@/i18n';
import * as XLSX from 'xlsx';
import Dropdown from '@/components/dropdown';
import { useAppSelector } from '@/store/hooks';
import Swal from 'sweetalert2';
import Link from 'next/link';

export const RoleTable = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<RoleListDto>>({
    columnAccessor: '',
    direction: 'asc',
  });
  const { t } = getTranslation();
  const isRTL = useAppSelector(state => state.theme.rtlClass) === 'rtl';

  const { data: roleListResponse, isLoading } = useRoleListQuery({
    page,
    pageSize,
    sortField: sortStatus.columnAccessor,
    sortDirection: sortStatus.direction === 'asc' ? SortDirection.Asc : SortDirection.Desc,
    search: search || undefined,
  });

  const [fetchRoles] = useLazyRoleListQuery();
  const [deleteRole] = useRoleDeleteMutation();

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

  type ExportFormat = 'excel' | 'csv';

  const exportData = async (format: ExportFormat, all: boolean) => {
    setIsExporting(true);
    try {
      let dataToExport;
      if (all) {
        const response = await fetchRoles({
          page,
          pageSize,
          sortField: sortStatus.columnAccessor,
          sortDirection: sortStatus.direction === 'asc' ? SortDirection.Asc : SortDirection.Desc,
          search: search || undefined,
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

  return (
    <div className="panel mt-6 min-w-[300px] sm:min-w-[600px] md:min-w-[750px] lg:min-w-[850px]">
      <div className="mb-5 flex flex-col gap-5 justify-between sm:flex-row sm:items-center">
        <h5 className="text-lg font-semibold dark:text-white-light">{t('page_roles_title')}</h5>
        <div className="flex items-center justify-around flex-wrap gap-4">
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
          <Link href="/roles/create" className="btn btn-primary flex items-center gap-2">
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
        <DataTable<RoleListDto>
          className="table-hover whitespace-nowrap"
          records={roleListResponse?.items || []}
          columns={[
            { accessor: 'name', sortable: true, title: t('table_roles_name') },
            { accessor: 'description', sortable: true, title: t('table_roles_description') },
            {
              accessor: 'users',
              title: t('table_roles_userCount'),
              render: (record) => record.users.length.toString(),
              sortable: false
            },
            {
              accessor: 'actions',
              title: t('table_actions'),
              sortable: false,
              render: (record) => (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/roles/update/${record.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <Pencil className="h-3 w-3" />
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <Link
                    href={`/roles/change-permissions/${record.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Shield className="h-3 w-3" />
                  </Link>
                </div>
              ),
            },
          ]}
          highlightOnHover
          totalRecords={roleListResponse?.total || 0}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          minHeight={200}
          paginationText={({ from, to, totalRecords }) => t('table_pagination_showing_entries', { from, to, totalRecords })}
          fetching={isLoading || isExporting}
          noRecordsText={t('table_no_records_found')}
          recordsPerPageLabel={''}
        />
      </div>
    </div>
  );
};
