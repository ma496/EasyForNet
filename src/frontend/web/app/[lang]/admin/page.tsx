import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import SaleDashboard from './_components/sale-dashboard'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.dashboard.title'),
  }
}

const Sales = () => {
  return <SaleDashboard />
}

export default Sales
