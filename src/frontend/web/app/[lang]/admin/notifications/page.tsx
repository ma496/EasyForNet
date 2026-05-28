import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { NotificationTable } from './_components/notification-table'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.notifications.title')
  }
}

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
