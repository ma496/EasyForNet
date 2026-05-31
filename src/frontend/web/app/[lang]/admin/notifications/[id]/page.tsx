import { getServerTranslation } from '@/i18n'
import { NotificationDetail } from './_components/notification-detail'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface NotificationDetailPageProps {
  params: Promise<{ lang: string; id: string }>
}

const NotificationDetailPage = async ({ params }: NotificationDetailPageProps) => {
  const { lang, id } = await params
  const title = await getServerTranslation(lang, 'page.notifications.detail.title')

  return (
    <AdminPageContent
      title={title}
    >
      <NotificationDetail id={id} />
    </AdminPageContent>
  )
}

export default NotificationDetailPage
