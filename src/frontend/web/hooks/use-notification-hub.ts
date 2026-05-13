'use client'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUnreadCount } from '@/store/slices/notificationsSlice'
import { useNotificationGetUnreadCountQuery } from '@/store/api/notifications/notifications-api'

const POLL_INTERVAL_MS = 30_000

export function useNotificationHub() {
  const dispatch = useAppDispatch()
  const { data } = useNotificationGetUnreadCountQuery({}, {
    pollingInterval: POLL_INTERVAL_MS,
  })

  useEffect(() => {
    if (data?.count !== undefined) {
      dispatch(setUnreadCount(data.count))
    }
  }, [data, dispatch])
}
