import { getDictionary } from '@/i18n'
import { Metadata } from 'next'
import SaleDashboard from './_components/sale-dashboard'

import { Locale } from '@/i18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.dashboard.title,
  }
}

const Sales = () => {
  return <SaleDashboard />
}

export default Sales
