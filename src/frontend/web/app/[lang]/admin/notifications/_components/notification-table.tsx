'use client'
import { useState } from 'react'
import { useTranslation } from '@/i18n'
import { createColumnHelper, SortingState, PaginationState, ColumnDef } from '@tanstack/react-table'
import { DataTableProvider } from '@/components/ui/data-table/context'
import { DataTableToolbar } from '@/components/ui/data-table/toolbar'
import { DataTablePagination } from '@/components/ui/data-table/pagination'
import { DataTable } from '@/components/ui/data-table'
import { confirmDeleteAlert, successToast } from '@/lib/utils'
import { NotificationDto } from '@/store/api/notifications/notifications-dtos'
import { NotificationType } from '@/store/api/notifications/enums'
import {
  useNotificationListQuery,
  useNotificationMarkAsReadMutation,
  useNotificationMarkAllAsReadMutation,
  useNotificationDeleteMutation
} from '@/store/api/notifications/notifications-api'
import { formatDistanceToNow } from 'date-fns'
import { Check, Trash2, CheckCheck, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LocalizedLink } from '@/components/localized-link'
import { Button } from '@/components/ui/button'
import { confirmAlert } from '@/lib/utils/notification'
import { NotificationFilterPanel, NotificationFilters } from './notification-filter-panel'
import { NotificationFilterButton } from './notification-filter-button'
import Truncated from '@/components/ui/truncated'

export const NotificationTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<NotificationFilters>({
    isRead: '',
    group: '',
  })
  const [pendingFilters, setPendingFilters] = useState<NotificationFilters>({
    isRead: '',
    group: '',
  })
  const { t } = useTranslation()

  const getIsReadValue = (value: string): boolean | null => {
    if (value === 'true') return true
    if (value === 'false') return false
    return null
  }

  const activeFiltersCount = [appliedFilters.isRead, appliedFilters.group].filter(Boolean).length

  const {
    data: notificationResponse,
    isFetching: isGettingNotifications
  } = useNotificationListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: globalFilter,
    isRead: getIsReadValue(appliedFilters.isRead),
    group: appliedFilters.group || undefined
  })

  const [markAsRead] = useNotificationMarkAsReadMutation()
  const [markAllAsRead] = useNotificationMarkAllAsReadMutation()
  const [deleteNotification] = useNotificationDeleteMutation()

  const handleSearch = () => {
    setAppliedFilters(pendingFilters)
    setPagination({ ...pagination, pageIndex: 0 })
  }

  const handleClear = () => {
    const clearedFilters = {
      isRead: '',
      group: '',
    }
    setPendingFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    setPagination({ ...pagination, pageIndex: 0 })
  }

  const handleFilterChange = (newFilters: NotificationFilters) => {
    setPendingFilters(newFilters)
  }

  const handleMarkAsRead = async (id: string) => {
    const { error } = await markAsRead({ id })
    if (!error) {
      successToast.fire({
        title: t('notifications.markedAsRead')
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await confirmAlert({
      title: t('notifications.markAllReadConfirmTitle'),
      text: t('notifications.markAllReadConfirmText')
    })
    if (result.isConfirmed) {
      const { error } = await markAllAsRead({})
      if (!error) {
        successToast.fire({
          title: t('notifications.markedAllAsRead')
        })
      }
    }
  }

  const handleDelete = async (id: string) => {
    const result = await confirmDeleteAlert({
      title: t('notifications.deleteTitle'),
      text: t('notifications.deleteConfirm')
    })
    if (result.isConfirmed) {
      const { error } = await deleteNotification({ id })
      if (!error) {
        successToast.fire({
          title: t('notifications.deleted')
        })
      }
    }
  }

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Warning:
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case NotificationType.Error:
        return <AlertCircle className="h-4 w-4 text-danger" />
      case NotificationType.Success:
        return <CheckCircle className="h-4 w-4 text-success" />
      default:
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Warning:
        return <Badge variant="warning">{t('notifications.types.warning')}</Badge>
      case NotificationType.Error:
        return <Badge variant="danger">{t('notifications.types.error')}</Badge>
      case NotificationType.Success:
        return <Badge variant="success">{t('notifications.types.success')}</Badge>
      default:
        return <Badge variant="primary">{t('notifications.types.info')}</Badge>
    }
  }

  const columnHelper = createColumnHelper<NotificationDto>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<NotificationDto, any>[] = [
    columnHelper.accessor('type', {
      header: t('table.columns.type'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(info.getValue())}
          {getTypeBadge(info.getValue())}
        </div>
      ),
      enableSorting: false
    }),
    columnHelper.accessor('titleKey', {
      header: t('table.columns.title'),
      cell: (info) => (
        <LocalizedLink
          href={`/admin/notifications/${info.row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {t(info.getValue())}
        </LocalizedLink>
      )
    }),
    columnHelper.accessor('messageKey', {
      header: t('table.columns.message'),
      cell: (info) => (
        // <span className="text-gray-500 dark:text-gray-400">{t(info.getValue())}</span>
        <Truncated
          text={t(info.getValue())}
          className="text-gray-500 dark:text-gray-400"
          underline={false}
        />
      ),
      enableSorting: false
    }),
    columnHelper.accessor('group', {
      header: t('table.columns.group'),
      cell: (info) => {
        const group = info.getValue()
        return (
          <span className="text-gray-500 dark:text-gray-400">
            {group ? t(`notifications.groups.${group}`, { defaultValue: group }) : '-'}
          </span>
        )
      },
      enableSorting: false
    }),
    columnHelper.accessor('isRead', {
      header: t('table.columns.status'),
      cell: (info) => (
        info.getValue() ? (
          <Badge variant="secondary">{t('notifications.read')}</Badge>
        ) : (
          <Badge variant="primary">{t('notifications.unread')}</Badge>
        )
      )
    }),
    columnHelper.accessor('createdAt', {
      header: t('table.columns.date'),
      cell: (info) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(info.getValue()), { addSuffix: true })}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table.actions'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {!info.row.original.isRead && (
            <button
              type="button"
              className="btn cursor-pointer btn-secondary btn-sm"
              onClick={() => handleMarkAsRead(info.row.original.id)}
              title={t('notifications.markAsRead')}
            >
              <Check className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            className="btn cursor-pointer btn-danger btn-sm"
            onClick={() => handleDelete(info.row.original.id)}
            title={t('notifications.delete')}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ),
    })
  ]

  return (
    <DataTableProvider
      data={notificationResponse?.items || []}
      rowCount={notificationResponse?.total || 0}
      columns={columns}
      enableRowSelection={false}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      isFetching={isGettingNotifications}
    >
      {filtersOpen && (
        <NotificationFilterPanel
          filters={pendingFilters}
          onChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      )}

      <DataTableToolbar>
        <div className="flex items-center gap-2">
          <NotificationFilterButton
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        <Button
          variant="secondary"
          icon={<CheckCheck className="h-4 w-4" />}
          onClick={handleMarkAllAsRead}
          disabled={!notificationResponse?.items?.some(n => !n.isRead)}
        >
          {t('notifications.markAllRead')}
        </Button>
      </DataTableToolbar>

      <DataTable />
      <DataTablePagination siblingCount={1} />
    </DataTableProvider>
  )
}
