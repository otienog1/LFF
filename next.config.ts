import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.theluigifootprints.org' }],
    unoptimized: true,
  },
}

export default nextConfig
