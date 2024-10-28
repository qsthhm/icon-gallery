'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [icons, setIcons] = useState([])

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 bg-gray-50 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">图标分类</h2>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer p-2 rounded ${
              currentCategory === 'all' ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => setCurrentCategory('all')}
          >
            全部图标
          </li>
        </ul>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* 图标将在这里显示 */}
        </div>
      </main>
    </div>
  )
}