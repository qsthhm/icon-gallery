// src/app/layout.js
import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'Icon Gallery - SVG图标管理与预览工具',
  description: '一个简洁易用的 SVG 图标管理和预览工具，支持分类浏览、搜索、复制和下载。',
  keywords: 'SVG, 图标, Icon, Gallery, 图标管理, 图标预览',
  authors: [{ name: 'Your Name' }],
  metadataBase: new URL('https://icon.qieyan.com'),
  openGraph: {
    title: 'Icon Gallery - SVG图标管理与预览工具',
    description: '一个简洁易用的 SVG 图标管理和预览工具，支持分类浏览、搜索、复制和下载。',
    type: 'website',
    locale: 'zh_CN',
    url: 'https://icon-gallery-two.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icon Gallery - SVG图标管理与预览工具',
    description: '一个简洁易用的 SVG 图标管理和预览工具，支持分类浏览、搜索、复制和下载。',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ogdwbybi2u");
          `}
        </Script>
        <main suppressHydrationWarning>
          {children}
        </main>
      </body>
    </html>
  )
}