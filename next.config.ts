import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // The site is a static export. In development the export flag is left off: with it on, the dev server answers any
  // URL outside generateStaticParams with an error overlay (E443) instead of the 404 page. Every dynamic page declares
  // dynamicParams = false, so unknown params are 404s in both modes; static-rendering violations surface at build time.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.theluigifootprints.org', pathname: '/wp-content/**' }],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
