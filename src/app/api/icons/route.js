import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const iconsDir = path.join(process.cwd(), 'public/icons')
    
    console.log('Reading icons from:', iconsDir)  // 添加日志
    
    if (!fs.existsSync(iconsDir)) {
      console.log('Icons directory does not exist')  // 添加日志
      return NextResponse.json([])
    }

    let icons = []
    
    if (category && category !== 'all') {
      const categoryPath = path.join(iconsDir, category)
      console.log('Reading category:', categoryPath)  // 添加日志
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
      console.log('Found categories:', categories)  // 添加日志
      
      categories.forEach(category => {
        const categoryPath = path.join(iconsDir, category)
        const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.svg'))
        console.log(`Found ${files.length} icons in ${category}`)  // 添加日志
        icons.push(...files.map(file => ({
          name: file.replace('.svg', ''),
          path: `/icons/${category}/${file}`,
          category
        })))
      })
    }
    
    console.log('Returning icons:', icons)  // 添加日志
    return NextResponse.json(icons)
  } catch (error) {
    console.error('Error reading icons:', error)
    return NextResponse.json([])
  }
}