import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ConsoleSignature from '@/components/terminal/ConsoleSignature'

const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dan Brown | Full-Stack Developer',
  description:
    'True Full-Stack Developer based in Ottawa.',
  icons: {
    icon: '/favicon.svg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        {children}
        <ConsoleSignature />
      </body>
    </html>
  )
}
