/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In App Router, i18n config is moved from here to middleware.ts and internationalization directory
  experimental: {
    // appDir: true,
  },
  // Remove hardcoded allowedDevOrigins to fix WebSocket connection issues
  // allowedDevOrigins: ['https://libronico.com'],
  
  // Set assetPrefix for development to ensure all assets are loaded from localhost
  assetPrefix: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined,
  
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
  // Add headers to prevent resources from being blocked
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' http://localhost:* https://localhost:*; 
                   script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:*; 
                   style-src 'self' 'unsafe-inline' http://localhost:* https://localhost:*; 
                   img-src 'self' data: http://localhost:* https://localhost:*; 
                   font-src 'self' data: http://localhost:* https://localhost:*; 
                   connect-src 'self' ws: wss: http://localhost:* https://localhost:* http://vhs-backend:* https://libronico.com;`,
          },
        ],
      },
    ];
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

export default nextConfig; 