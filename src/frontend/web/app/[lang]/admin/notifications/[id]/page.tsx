import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { NotificationDetail } from './_components/notification-detail'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface NotificationDetailPageProps {
  params: Promise<{ lang: string; id: string }>
}

export async function generateMetadata({ params }: NotificationDetailPageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.notifications.detail.title
  }
}

const NotificationDetailPage = async ({ params }: NotificationDetailPageProps) => {
  const { lang, id } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent
      title={dict.page.notifications.detail.title}
    >
      <NotificationDetail id={id} />
    </AdminPageContent>
  )
}

export default NotificationDetailPage
