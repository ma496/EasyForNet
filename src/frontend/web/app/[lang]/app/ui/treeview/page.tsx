import { Metadata } from 'next'
import { Locale } from '@/i18n'
import { getDictionary } from '@/i18n'
import { TreeviewExample } from "./_components/treeview-example"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.treeview.title,
  }
}

const TreeviewPage = () => {
  return (
    <div className="flex justify-center items-center">
      <TreeviewExample />
    </div>
  )
}

export default TreeviewPage
