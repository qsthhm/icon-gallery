import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public/icons')
    if (!fs.existsSync(iconsDir)) {
      return NextResponse.json([])
    }
    const categories = fs.readdirSync(iconsDir).filter(
      file => fs.statSync(path.join(iconsDir, file)).isDirectory()
    )
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error reading categories:', error)
    return NextResponse.json([])
  }
}