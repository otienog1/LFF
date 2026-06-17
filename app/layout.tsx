import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import Layout from '@/components/layout/Layout'
import '../styles/globals.css'

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
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
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="msapplication-TileColor" content="#FAF8F4" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#FAF8F4" />
      </head>
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>
        <Script src="/js/imagesloaded.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
