import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '../styles/tailwind.css';


export const metadata: Metadata = {
  title: {
    template: '%s | Easy For Net - Full Stack Web Application',
    default: 'Easy For Net - Full Stack Web Application',
  },
};
const nunito = Nunito({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={nunito.variable}>
        <MantineProvider defaultColorScheme="auto">
          <ProviderComponent>{children}</ProviderComponent>
        </MantineProvider>
      </body>
    </html>
  );
}
