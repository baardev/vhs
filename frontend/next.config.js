import { i18n } from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // List all supported languages
    locales: ['en', 'es', 'zh', 'ru', 'he'],
    // Default language when no locale is specified in URL
    defaultLocale: 'en',
    // Explicitly disable automatic locale detection to satisfy Next.js schema
    localeDetection: false
  },
  allowedDevOrigins: ['https://libronico.com'],
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
  // Add rewrites to direct API requests to the backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://vhs-backend:4000/api/:path*'  // Development - use backend container name and port
          : 'https://libronico.com/api/:path*',  // Production
      },
    ];
  },
};

export default nextConfig;