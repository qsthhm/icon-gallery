import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public/icons')
    const categories = fs.readdirSync(iconsDir).filter(
      file => fs.statSync(path.join(iconsDir, file)).isDirectory()
    )
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}