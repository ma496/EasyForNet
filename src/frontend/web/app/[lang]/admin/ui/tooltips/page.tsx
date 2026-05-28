import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { TooltipExample } from "./_components/tooltip-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.tooltip.title'),
  }
}

interface TooltipPageProps {
  params: Promise<{ lang: string }>
}

const TooltipPage = async ({ params }: TooltipPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.tooltip.title')

  return (
    <AdminPageContent title={title}>
      <TooltipExample />
    </AdminPageContent>
  )
}

export default TooltipPage
