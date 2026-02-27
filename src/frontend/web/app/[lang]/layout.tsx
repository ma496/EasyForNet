import ProviderComponent from '@/components/layouts/provider-component'
import { Nunito } from 'next/font/google'
import { i18nConfig, type Locale } from '@/i18n'
import { getDictionary } from '@/i18n'
import { TranslationProvider } from '@/components/layouts/translation-provider'

import 'react-perfect-scrollbar/dist/css/styles.css'
import '../../styles/tailwind.css'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return {
    title: {
      template: `%s | ${dictionary.brand.name}`,
      default: dictionary.brand.name,
    },
  }
}
const nunito = Nunito({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as Locale)

  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning={true}>
      <head></head>
      <body className={nunito.variable} suppressHydrationWarning={true}>
        <TranslationProvider dictionary={dictionary}>
          <ProviderComponent>{children}</ProviderComponent>
        </TranslationProvider>
      </body>
    </html>
  )
}
