import { Metadata } from 'next'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { FormElementsExample } from "./_components/form-elements-example"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.formElements.title,
  }
}

const FormElementsPage = () => {
  return (
    <div className="flex justify-center items-center">
      <FormElementsExample />
    </div>
  )
}

export default FormElementsPage
