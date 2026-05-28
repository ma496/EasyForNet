import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { FormElementsExample } from "./_components/form-elements-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.formElements.title'),
  }
}

interface FormElementsPageProps {
  params: Promise<{ lang: string }>
}

const FormElementsPage = async ({ params }: FormElementsPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.formElements.title')

  return (
    <AdminPageContent title={title}>
      <FormElementsExample />
    </AdminPageContent>
  )
}

export default FormElementsPage
