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
        const categoryMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
        metadata[category] = categoryMetadata
      }
    })

    return NextResponse.json(metadata)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}