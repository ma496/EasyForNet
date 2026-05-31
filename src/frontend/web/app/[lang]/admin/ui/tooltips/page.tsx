import { getServerTranslation } from '@/i18n'
import { TooltipExample } from "./_components/tooltip-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

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
