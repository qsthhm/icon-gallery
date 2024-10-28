'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [icons, setIcons] = useState([])

  useEffect(() => {
    // 获取分类
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log('categories:', data)  // 添加日志
        setCategories(data)
      })
  }, [])

  useEffect(() => {
    // 获取图标
    fetch(`/api/icons${currentCategory === 'all' ? '' : `?category=${currentCategory}`}`)
      .then(res => res.json())
      .then(data => {
        console.log('icons:', data)  // 添加日志
        setIcons(data)
      })
  }, [currentCategory])

  return (
    <div className="flex min-h-screen">
      {/* 左侧分类 */}
      <aside className="w-64 bg-gray-50 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">图标分类</h2>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer p-2 rounded ${
              currentCategory === 'all' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setCurrentCategory('all')}
          >
            全部图标
          </li>
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer p-2 rounded ${
                currentCategory === category ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* 右侧图标网格 */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {icons.map((icon) => (
            <div key={icon.path} className="p-4 border rounded hover:shadow-lg">
              <div className="h-16 flex items-center justify-center mb-2">
                <img 
                  src={icon.path} 
                  alt={icon.name}
                  className="w-8 h-8"
                />
              </div>
              <p className="text-sm text-center mb-2">{icon.name}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fetch(icon.path)
                    .then(res => res.text())
                    .then(svg => navigator.clipboard.writeText(svg))
                  }
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  复制代码
                </button>
                <button
                  onClick={() => window.open(icon.path, '_blank')}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  下载
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}