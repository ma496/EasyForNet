import { getServerTranslation } from '@/i18n'
import { Metadata } from 'next'
import { CardsExample } from "./_components/cards-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: await getServerTranslation(lang, 'page.ui.cards.title'),
  }
}

interface CardsPageProps {
  params: Promise<{ lang: string }>
}

const CardsPage = async ({ params }: CardsPageProps) => {
  const { lang } = await params
  const title = await getServerTranslation(lang, 'page.ui.cards.title')

  return (
    <AdminPageContent title={title}>
      <CardsExample />
    </AdminPageContent>
  )
}

export default CardsPage
