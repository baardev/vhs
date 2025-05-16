const { i18n } = require('./next-i18next.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
  i18n: {
    // List all supported languages
    locales: ['en', 'es', 'zh', 'ru', 'he'],
    // Default language when no locale is specified in URL
    defaultLocale: 'en',
    // Explicitly disable automatic locale detection to satisfy Next.js schema
    localeDetection: false
  },
  */
  // Remove the hardcoded allowedDevOrigins to fix WebSocket connections
  // allowedDevOrigins: ['https://libronico.com'],
  
  // Set assetPrefix for development to ensure all assets are loaded from localhost
  assetPrefix: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined,
  
  images: {
    domains: ['localhost'],
  },
  
  env: {
    NEXT_PUBLIC_HOSTNAME: 'localhost',
    NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  },
  
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable cache
  onDemandEntries: {
    // Keep in memory for this seconds (set to low value)
    maxInactiveAge: 10,
    // Don't dispose inactive pages
    pagesBufferLength: 1,
  },
  // Disable all kinds of caching
  generateEtags: false,
  // Add rewrites to direct API requests to the backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://vhs-backend:4000/api/:path*'  // Development
          : 'https://libronico.com/api/:path*',   // Production
      },
    ];
  },
  // Add headers to prevent caching and add Content-Security-Policy
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
  // Configure webpack to set the __NEXT_WEBPACK_PUBLIC_HOSTNAME variable
  webpack: (config, { isServer, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__NEXT_WEBPACK_PUBLIC_HOSTNAME': JSON.stringify(
          process.env.NEXT_PUBLIC_HOSTNAME || 'localhost'
        ),
      })
    );
    return config;
  },
};

module.exports = nextConfig;