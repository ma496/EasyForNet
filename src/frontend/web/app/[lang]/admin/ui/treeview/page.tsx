import { getServerTranslation } from '@/i18n'
import { TreeviewExample } from "./_components/treeview-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

interface TreeviewPageProps {
  params: Promise<{ lang: string }>
}

const TreeviewPage = async ({ params }: TreeviewPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.treeview.title')

  return (
    <AdminPageContent title={title}>
      <TreeviewExample />
    </AdminPageContent>
  )
}

export default TreeviewPage
