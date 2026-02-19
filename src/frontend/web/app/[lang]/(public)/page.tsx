import Hero from './_components/hero'
import Features from './_components/features'
import CTA from './_components/cta'
import Footer from './_components/footer'
import { Locale } from '@/i18n-config'

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
