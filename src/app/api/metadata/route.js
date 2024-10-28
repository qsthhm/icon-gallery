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
         metadata[category] = JSON.parse(content)
         console.log(`Parsed metadata for ${category}:`, metadata[category])
       } catch (error) {
         console.error(`Error reading metadata for ${category}:`, error)
         metadata[category] = {
           categoryName: category,
           icons: {}
         }
       }
     } else {
       console.log(`No metadata.json found for ${category}`)
       metadata[category] = {
         categoryName: category,
         icons: {}
       }
     }
   }

   console.log('Final metadata:', metadata)
   return NextResponse.json(metadata, {
     headers: {
       'Content-Type': 'application/json; charset=utf-8',
       'Cache-Control': 'no-store, must-revalidate',
     },
   })
 } catch (error) {
   console.error('API error:', error)
   return NextResponse.json({ error: error.message }, { 
     status: 500,
     headers: {
       'Content-Type': 'application/json; charset=utf-8',
       'Cache-Control': 'no-store, must-revalidate',
     },
   })
 }
}