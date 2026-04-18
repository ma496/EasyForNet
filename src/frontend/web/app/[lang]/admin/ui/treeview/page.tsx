import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { TreeviewExample } from "./_components/treeview-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.treeview.title,
  }
}

interface TreeviewPageProps {
  params: Promise<{ lang: string }>
}

const TreeviewPage = async ({ params }: TreeviewPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.treeview.title}>
      <TreeviewExample />
    </AdminPageContent>
  )
}

export default TreeviewPage
