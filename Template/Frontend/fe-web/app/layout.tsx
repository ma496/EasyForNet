import ProviderComponent from '@/components/layouts/provider-component'
import { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import 'react-perfect-scrollbar/dist/css/styles.css'
import '../styles/tailwind.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning={true}>
      <head></head>
      <body className={nunito.variable} suppressHydrationWarning={true}>
        <ProviderComponent>{children}</ProviderComponent>
      </body>
    </html>
  )
}
