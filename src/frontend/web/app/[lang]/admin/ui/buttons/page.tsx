import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { ButtonsExample } from "./_components/buttons-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.buttons.title,
  }
}

interface ButtonsPageProps {
  params: Promise<{ lang: string }>
}

const ButtonsPage = async ({ params }: ButtonsPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.buttons.title}>
      <ButtonsExample />
    </AdminPageContent>
  )
}

export default ButtonsPage
