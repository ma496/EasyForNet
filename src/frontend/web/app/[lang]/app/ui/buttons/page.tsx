import { Metadata } from 'next'
import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { ButtonsExample } from "./_components/buttons-example"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.buttons.title,
  }
}

const ButtonsPage = () => {
  return (
    <div className="flex justify-center items-center">
      <ButtonsExample />
    </div>
  )
}

export default ButtonsPage
