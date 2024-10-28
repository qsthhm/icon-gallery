/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `
                default-src 'self';
                script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' https:;
                style-src 'self' 'unsafe-inline';
                img-src 'self' data: blob: https:;
                font-src 'self';
                connect-src 'self';
                worker-src 'self';
                manifest-src 'self';
                base-uri 'self';
                form-action 'self';
                frame-ancestors 'none';
                block-all-mixed-content;
                upgrade-insecure-requests;
              `.replace(/\s+/g, ' ').trim()
            }
          ],
        }
      ]
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack']
      })
      return config
    }
  }
  
  module.exports = nextConfig