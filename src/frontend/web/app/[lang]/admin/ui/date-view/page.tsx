import { getServerTranslation } from '@/i18n'
import { DateViewExample } from './_components/date-view-example'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface DateViewPageProps {
  params: Promise<{ lang: string }>
}

const DateViewPage = async ({ params }: DateViewPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.dateView.title')

  return (
    <AdminPageContent title={title}>
      <DateViewExample />
    </AdminPageContent>
  )
}

export default DateViewPage
