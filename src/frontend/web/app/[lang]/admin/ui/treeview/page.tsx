import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { TreeviewExample } from "./_components/treeview-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.treeview.title'),
  }
}

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
