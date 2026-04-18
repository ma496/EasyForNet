import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { DateViewExample } from './_components/date-view-example'
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.dateView.title,
  }
}

interface DateViewPageProps {
  params: Promise<{ lang: string }>
}

const DateViewPage = async ({ params }: DateViewPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.dateView.title}>
      <DateViewExample />
    </AdminPageContent>
  )
}

export default DateViewPage
