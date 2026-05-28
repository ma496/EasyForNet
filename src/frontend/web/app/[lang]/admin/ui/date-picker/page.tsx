import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { DatePickerExample } from "./_components/date-picker-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.datePicker.title'),
  }
}

interface DatePickerPageProps {
  params: Promise<{ lang: string }>
}

const DatePickerPage = async ({ params }: DatePickerPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.datePicker.title')

  return (
    <AdminPageContent title={title}>
      <DatePickerExample />
    </AdminPageContent>
  )
}

export default DatePickerPage
