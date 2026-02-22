import { Metadata } from 'next'
import { Locale } from '@/i18n'
import { getDictionary } from '@/get-dictionary'
import UnauthorizedView from './_components/unauthorized-view'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.auth.unauthorized.title,
  }
}

const UnauthorizedPage = () => {
  return <UnauthorizedView />
}

export default UnauthorizedPage
