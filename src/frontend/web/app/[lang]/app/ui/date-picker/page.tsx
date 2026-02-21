import { Metadata } from 'next'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { DatePickerExample } from "./_components/date-picker-example"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.datePicker.title,
  }
}

const DatePickerPage = () => {
  return (
    <div className="flex justify-center items-center">
      <DatePickerExample />
    </div>
  )
}

export default DatePickerPage
