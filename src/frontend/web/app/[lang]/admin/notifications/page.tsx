import { getServerTranslation } from '@/i18n'
import { NotificationTable } from './_components/notification-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface NotificationsProps {
  params: Promise<{ lang: string }>
}

const Notifications = async ({ params }: NotificationsProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.notifications.title')
  return (
    <AdminPageContent title={title}>
      <NotificationTable />
    </AdminPageContent>
  )
}

export default Notifications
