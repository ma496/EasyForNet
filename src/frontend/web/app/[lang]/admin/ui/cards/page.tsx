import { getServerTranslation } from '@/i18n'
import { CardsExample } from "./_components/cards-example"
import { AdminPageContent } from '@/components/layouts/admin-page-content'

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
