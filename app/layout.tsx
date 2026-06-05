import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import GsapTransitionWrapper from '@/components/GsapTransitionWrapper'
import '../styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Luigi Footprints Foundation',
    default: 'Luigi Footprints Foundation',
  },
  description: 'We are a Non-Governmental Organization involved in wildlife conservation and community development',
  icons: {
    apple: '/favicon/apple-touch-icon.png',
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    other: [{ rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#000000' }],
  },
  manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="msapplication-TileColor" content="#1a1510" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#1a1510" />
      </head>
      <body className="bg-base text-cream">
        <GsapTransitionWrapper>
          {children}
        </GsapTransitionWrapper>
        <Script src="/js/imagesloaded.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
