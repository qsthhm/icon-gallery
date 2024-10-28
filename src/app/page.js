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
      .then(setCategories)
      .catch(console.error)
  }, [])

  useEffect(() => {
    // 获取图标
    fetch(`/api/icons${currentCategory === 'all' ? '' : `?category=${currentCategory}`}`)
      .then(res => res.json())
      .then(setIcons)
      .catch(console.error)
  }, [currentCategory])

  const copyIconCode = async (path) => {
    try {
      const response = await fetch(path)
      const svg = await response.text()
      await navigator.clipboard.writeText(svg)
      alert('复制成功！')
    } catch (error) {
      console.error('复制失败:', error)
      alert('复制失败')
    }
  }

  return (
    <div className="flex min-h-screen">
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
          {categories.map(category => (
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

      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {icons.map((icon, index) => (
            <div key={index} className="p-4 border rounded hover:shadow-lg">
              <div className="h-16 flex items-center justify-center mb-2">
                <img
                  src={icon.path}
                  alt={icon.name}
                  className="w-8 h-8"
                  style={{ filter: 'none' }}
                />
              </div>
              <p className="text-sm text-center mb-2">{icon.name}</p>
              <button
                onClick={() => copyIconCode(icon.path)}
                className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                复制代码
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}