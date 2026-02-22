import { Metadata } from 'next'
import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import { CardsExample } from "./_components/cards-example"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.cards.title,
  }
}

const CardsPage = () => {
  return (
    <div className="flex justify-center items-center">
      <CardsExample />
    </div>
  )
}

export default CardsPage
