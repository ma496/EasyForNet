'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useUserListQuery } from '@/store/api/users/users-api';
import { SortDirection } from '@/store/api/base/sort-direction';
import { UserListDto } from '@/store/api/users/dto/user-list-response';
import { Search } from 'lucide-react';
import { getTranslation } from '@/i18n';

export const UserTable = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<UserListDto>>({
    columnAccessor: '',
    direction: 'asc',
  });
  const { t } = getTranslation();

  const { data: userListResponse, isLoading } = useUserListQuery({
    page,
    pageSize,
    sortField: sortStatus.columnAccessor,
    sortDirection: sortStatus.direction === 'asc' ? SortDirection.Asc : SortDirection.Desc,
    search: search || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

  return (
    <div className="panel mt-6">
      <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
        <h5 className="text-lg font-semibold dark:text-white-light">{t('page_users_title')}</h5>
        <div className="ltr:ml-auto rtl:mr-auto">
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
          fetching={isLoading}
          noRecordsText={t('table_no_records_found')}
          recordsPerPageLabel={''}
        />
      </div>
    </div>
  );
};
