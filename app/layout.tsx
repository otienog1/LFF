import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import Layout from '@/components/layout/Layout'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/site'
import '../styles/globals.css'

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description:
    'A Kenyan foundation protecting wildlife by empowering the communities who live alongside it, in the Amboseli ecosystem, Nairobi National Park and the Samburu National Reserve.',
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    apple: '/favicon/apple-touch-icon.png',
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#FAF8F4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* The export is one HTML shell per page: set the document language from the URL before first paint,
            and lower the curtain so the first frame is the transition overlay, not the unanimated page. Scroll
            restoration is the page transition's (it places reloads and returns under the curtain), so the browser's
            own is switched off before it can move the page. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{history.scrollRestoration='manual'}catch(e){}var s=location.pathname.split('/')[1];document.documentElement.lang=(s==='es'||s==='pt')?s:'en';document.documentElement.setAttribute('data-transition','covered');",
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
