import { Metadata } from 'next'
import { getDictionary } from '@/get-dictionary'
import Hero from './_components/hero'
import Features from './_components/features'
import CTA from './_components/cta'
import Footer from './_components/footer'
import { Locale } from '@/i18n-config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.page.home.title,
  }
}

export default async function LandingPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Features lang={lang} />
      <CTA lang={lang} />
      <Footer lang={lang} />
    </div>
  )
}
