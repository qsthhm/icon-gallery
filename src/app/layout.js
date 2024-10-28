import './globals.css'



export const metadata = {
  title: 'Icon Gallery',
  description: '一个简洁易用的 SVG 图标预览工具，支持分类浏览、搜索、复制和下载。',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}