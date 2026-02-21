import { Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { Metadata } from 'next'
import { DateViewExample } from './_components/date-view-example'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.dateView.title,
  }
}

const DateViewPage = () => {
  return <DateViewExample />
}

export default DateViewPage
