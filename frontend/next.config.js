/** @type {import('next').NextConfig} */
import { i18n } from './next-i18next.config.js';

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // List all supported languages
    locales: ['en', 'es', 'zh', 'ru', 'he'],
    // Default language when no locale is specified in URL
    defaultLocale: 'en',
    // Enable URL-based locale detection
    localeDetection: true
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
  // Add rewrites to direct API requests to the backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost/api/:path*', // Use absolute HTTPS URL
      },
    ];
  },
}

export default nextConfig;