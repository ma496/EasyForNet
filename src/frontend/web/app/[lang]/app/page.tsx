import { Metadata } from 'next'
import SaleDashboard from './_components/sale-dashboard'

import { getDictionary } from '../../../get-dictionary'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dict = await getDictionary(lang as any)
  return {
    title: dict.page.dashboard.title,
  }
}

const Sales = () => {
  return <SaleDashboard />
}

export default Sales
