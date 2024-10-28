import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const iconsDir = path.join(process.cwd(), 'public/icons')
    
    if (!fs.existsSync(iconsDir)) {
      return NextResponse.json([])
    }

    let icons = []
    
    if (category) {
      const categoryPath = path.join(iconsDir, category)
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.svg'))
        icons = files.map(file => ({
          name: file.replace('.svg', ''),
          path: `/icons/${category}/${file}`,
          category
        }))
      }
    } else {
      const categories = fs.readdirSync(iconsDir).filter(
        file => fs.statSync(path.join(iconsDir, file)).isDirectory()
      )
      
      categories.forEach(category => {
        const categoryPath = path.join(iconsDir, category)
        const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.svg'))
        icons.push(...files.map(file => ({
          name: file.replace('.svg', ''),
          path: `/icons/${category}/${file}`,
          category
        })))
      })
    }
    
    return NextResponse.json(icons)
  } catch (error) {
    console.error('Error reading icons:', error)
    return NextResponse.json([])
  }
}