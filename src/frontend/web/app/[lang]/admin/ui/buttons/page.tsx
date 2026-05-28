import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { ButtonsExample } from "./_components/buttons-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.buttons.title'),
  }
}

interface ButtonsPageProps {
  params: Promise<{ lang: string }>
}

const ButtonsPage = async ({ params }: ButtonsPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.buttons.title')

  return (
    <AdminPageContent title={title}>
      <ButtonsExample />
    </AdminPageContent>
  )
}

export default ButtonsPage
