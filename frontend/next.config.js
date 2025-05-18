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
  
  // Use a relative assetPrefix to avoid CORS issues
  assetPrefix: '',
  
  // Use proper configuration for App Router
  // Include only app directory files in the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  images: {
    domains: ['localhost', 'libronico.com'],
  },
  
  // Use relative paths for environment variables
  env: {
    NEXT_PUBLIC_HOSTNAME: '',
    NEXT_PUBLIC_BASE_URL: '',
    NEXT_PUBLIC_CACHE_BUSTER: Date.now().toString(),
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
      // Use local Next.js API routes for specific endpoints
      {
        source: '/api/courses',
        destination: '/api/courses',
      },
      {
        source: '/api/courses/:id',
        destination: '/api/courses/:id',
      },
      // Then fallback to the backend for all other API routes
      {
        source: '/api/:path*',
        destination: 'http://backend:4000/api/:path*',
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
          // Add CORS headers to allow all origins
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS, PUT, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Origin, X-Requested-With, Content-Type, Accept, Authorization' },
        ],
      },
    ];
  },
  // Configure webpack to set the __NEXT_WEBPACK_PUBLIC_HOSTNAME variable
  webpack: (config, { isServer, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__NEXT_WEBPACK_PUBLIC_HOSTNAME': JSON.stringify('')
      })
    );
    
    // Ignore all files in the pages directory
    config.resolve.alias = {
      ...config.resolve.alias,
      './pages': false,
      '../pages': false,
      '../../pages': false,
    };
    
    return config;
  },
};

module.exports = nextConfig;