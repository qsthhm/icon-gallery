import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
 try {
   // 改用 src/data/metadata 目录
   const metadataDir = path.join(process.cwd(), 'src', 'data', 'metadata')
   console.log('Metadata directory:', metadataDir)

   if (!fs.existsSync(metadataDir)) {
     console.log('Metadata directory does not exist')
     return NextResponse.json({})
   }

   const metadata = {}
   const files = fs.readdirSync(metadataDir)
     .filter(file => file.endsWith('.json'))

   console.log('Found metadata files:', files)

   for (const file of files) {
     try {
       const category = path.basename(file, '.json')
       const content = fs.readFileSync(path.join(metadataDir, file), 'utf8')
       console.log(`Raw content for ${category}:`, content)
       
       metadata[category] = JSON.parse(content)
     } catch (error) {
       console.error(`Error reading metadata file ${file}:`, error)
     }
   }

   // 读取图标目录以获取没有元数据的分类
   const iconsDir = path.join(process.cwd(), 'public', 'icons')
   if (fs.existsSync(iconsDir)) {
     const categories = fs.readdirSync(iconsDir)
       .filter(file => fs.statSync(path.join(iconsDir, file)).isDirectory())
     
     // 为没有元数据的分类添加默认值
     categories.forEach(category => {
       if (!metadata[category]) {
         metadata[category] = {
           categoryName: category,
           icons: {}
         }
       }
     })
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