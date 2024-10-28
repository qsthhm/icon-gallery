import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public/icons')
    
    // 确保目录存在
    if (!fs.existsSync(iconsDir)) {
      console.log('Icons directory not found');
      return NextResponse.json({})
    }

    const metadata = {}
    
    // 获取所有分类目录
    const categories = fs.readdirSync(iconsDir)
      .filter(file => {
        try {
          return fs.statSync(path.join(iconsDir, file)).isDirectory()
        } catch (error) {
          console.error(`Error checking directory ${file}:`, error)
          return false
        }
      })
    
    console.log('Found categories:', categories);

    // 读取每个分类的 metadata.json
    categories.forEach(category => {
      const metadataPath = path.join(iconsDir, category, 'metadata.json')
      console.log('Checking metadata path:', metadataPath);
      
      if (fs.existsSync(metadataPath)) {
        try {
          const data = fs.readFileSync(metadataPath, 'utf8')
          metadata[category] = JSON.parse(data)
          console.log(`Loaded metadata for ${category}:`, metadata[category])
        } catch (error) {
          console.error(`Error loading metadata for ${category}:`, error)
        }
      } else {
        console.log(`No metadata.json found for ${category}`);
      }
    })

    console.log('Final metadata:', metadata);
    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error in metadata API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}