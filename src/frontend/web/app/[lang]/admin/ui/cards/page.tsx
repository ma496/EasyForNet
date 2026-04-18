import { Locale, getDictionary } from '@/i18n'
import { Metadata } from 'next'
import { CardsExample } from "./_components/cards-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.ui.cards.title,
  }
}

interface CardsPageProps {
  params: Promise<{ lang: string }>
}

const CardsPage = async ({ params }: CardsPageProps) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AdminPageContent title={dict.page.ui.cards.title}>
      <CardsExample />
    </AdminPageContent>
  )
}

export default CardsPage
