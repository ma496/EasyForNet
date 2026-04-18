import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { FormElementsExample } from "./_components/form-elements-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.formElements.title,
  }
}

interface FormElementsPageProps {
  params: Promise<{ lang: string }>
}

const FormElementsPage = async ({ params }: FormElementsPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.formElements.title}>
      <FormElementsExample />
    </AdminPageContent>
  )
}

export default FormElementsPage
