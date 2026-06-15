import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.theluigifootprints.org', pathname: '/wp-content/**' }],
    unoptimized: true,
  },
}

export default nextConfig
