/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'your-supabase-project.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'keyreach-crm.vercel.app' }
    ],
    domains: ['localhost', 'keyreach-crm.vercel.app'],
    unoptimized: true,
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  output: 'standalone',

  webpack: (config, { dev, isServer }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        net: false,
        dns: false,
        tls: false,
        fs: false,
        request: false,
        ...config.resolve.fallback,
      }
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [{ name: 'removeViewBox', active: false }]
          }
        }
      }]
    });

    return config;
  },

  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack']
      }
    },
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: '2mb'
    },
    optimizePackageImports: ['@chakra-ui/react', 'framer-motion']
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  productionBrowserSourceMaps: false,

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2
  },

  headers: async () => [{
    source: '/:path*',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
    ]
  }]
};

module.exports = nextConfig;
