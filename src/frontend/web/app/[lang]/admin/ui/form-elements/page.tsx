import { getServerTranslation } from '@/i18n'
import { FormElementsExample } from "./_components/form-elements-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

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
