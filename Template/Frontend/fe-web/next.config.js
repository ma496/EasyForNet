/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable Typed Routes (stable in Next.js 15.5)
  typedRoutes: true,
  
  experimental: {
    // Optional: Enable Turbopack for development (beta)
    // turbo: {
    //   rules: {
    //     // Custom Turbopack rules if needed
    //   }
    // }
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
