import ProviderComponent from '@/components/layouts/provider-component'
import { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { i18n, type Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { TranslationProvider } from '@/components/layouts/translation-provider'

import 'react-perfect-scrollbar/dist/css/styles.css'
import '../../styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Easy For Net',
    default: 'Easy For Net',
  },
}
const nunito = Nunito({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
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
