import Hero from './_components/hero'
import Features from './_components/features'
import CTA from './_components/cta'
import Footer from './_components/footer'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}
