import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public/icons')
    
    // 确保目录存在
    if (!fs.existsSync(iconsDir)) {
      return NextResponse.json([])
    }

    // 获取所有子目录
    const categories = fs.readdirSync(iconsDir)
      .filter(file => {
        try {
          return fs.statSync(path.join(iconsDir, file)).isDirectory()
        } catch (error) {
          console.error(`Error checking directory ${file}:`, error)
          return false
        }
      })

    console.log('Found categories:', categories) // 调试日志
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in categories API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}