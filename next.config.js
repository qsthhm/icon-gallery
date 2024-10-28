/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'"
            }
          ]
        }
      ]
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**'
        }
      ]
    }
  }
  
  module.exports = nextConfig