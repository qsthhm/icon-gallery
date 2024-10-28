import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
 try {
   const iconsDir = path.join(process.cwd(), 'public/icons')
   console.log('Icons directory:', iconsDir)

   if (!fs.existsSync(iconsDir)) {
     console.log('Icons directory does not exist')
     return NextResponse.json({})
   }

   const metadata = {}
   const categories = fs.readdirSync(iconsDir)
     .filter(file => fs.statSync(path.join(iconsDir, file)).isDirectory())

   console.log('Found categories:', categories)

   for (const category of categories) {
     const metadataPath = path.join(iconsDir, category, 'metadata.json')
     console.log('Checking metadata path:', metadataPath)

     if (fs.existsSync(metadataPath)) {
       try {
         const content = fs.readFileSync(metadataPath, 'utf8')
         console.log(`Raw content for ${category}:`, content)
         
         // 直接使用文件中的内容
         metadata[category] = JSON.parse(content)
       } catch (error) {
         console.error(`Error reading metadata for ${category}:`, error)
         // 如果读取失败，使用默认值
         metadata[category] = {
           categoryName: category,
           icons: {}
         }
       }
     } else {
       // 如果文件不存在，使用默认值
       metadata[category] = {
         categoryName: category,
         icons: {}
       }
     }
   }

   console.log('Final metadata:', JSON.stringify(metadata, null, 2))
   
   return new NextResponse(JSON.stringify(metadata), {
     headers: {
       'Content-Type': 'application/json; charset=utf-8',
       'Cache-Control': 'no-store, no-cache, must-revalidate',
     },
   })
 } catch (error) {
   console.error('API error:', error)
   return NextResponse.json({
     error: error.message
   }, { status: 500 })
 }
}