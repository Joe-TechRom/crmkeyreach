/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'jntbefyqkqciwgkofttx.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' }
    ],
    unoptimized: true
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'perf_hooks': false,
      net: false,
      dns: false,
      tls: false,
      fs: false,
      request: false
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
    optimizePackageImports: ['@chakra-ui/react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true
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
