import { getServerTranslation } from '@/i18n'
import { DatePickerExample } from "./_components/date-picker-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

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
