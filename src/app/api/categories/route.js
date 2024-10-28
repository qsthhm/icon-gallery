import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public/icons')
    const categories = fs.readdirSync(iconsDir).filter(
      file => fs.statSync(path.join(iconsDir, file)).isDirectory()
    )

    const metadata = {}
    
    categories.forEach(category => {
      const metadataPath = path.join(iconsDir, category, 'metadata.json')
      if (fs.existsSync(metadataPath)) {
        try {
          const data = fs.readFileSync(metadataPath, 'utf8')
          const categoryMetadata = JSON.parse(data)
          metadata[category] = categoryMetadata
          console.log(`Loaded metadata for ${category}:`, categoryMetadata)  // 调试日志
        } catch (err) {
          console.error(`Error loading metadata for ${category}:`, err)
        }
      }
    })

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Metadata API error:', error)  // 调试日志
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}