import { i18n } from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the imported i18n configuration
  i18n,
  allowedDevOrigins: ['https://libronico.com'],
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
        destination: process.env.NODE_ENV === 'development'
          ? 'https://localhost/api/:path*'  // Development
          : 'https://libronico.com/api/:path*',  // Production
      },
    ];
  },
};

export default nextConfig;