import type { NextConfig } from "next";
const { i18n } = require('./next-i18next.config')

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n,
};
// next.config.js
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};



export default nextConfig;
module.exports = nextConfig;
