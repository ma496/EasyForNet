import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { TooltipExample } from "./_components/tooltip-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.tooltip.title,
  }
}

interface TooltipPageProps {
  params: Promise<{ lang: string }>
}

const TooltipPage = async ({ params }: TooltipPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.tooltip.title}>
      <TooltipExample />
    </AdminPageContent>
  )
}

export default TooltipPage
