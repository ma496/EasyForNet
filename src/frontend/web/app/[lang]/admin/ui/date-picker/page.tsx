import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { DatePickerExample } from "./_components/date-picker-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.datePicker.title,
  }
}

interface DatePickerPageProps {
  params: Promise<{ lang: string }>
}

const DatePickerPage = async ({ params }: DatePickerPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.datePicker.title}>
      <DatePickerExample />
    </AdminPageContent>
  )
}

export default DatePickerPage
