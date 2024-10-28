'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [icons, setIcons] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Categories:', data)
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Error fetching categories:', error)
      })
  }, [])

  useEffect(() => {
    const url = currentCategory === 'all' 
      ? '/api/icons'
      : `/api/icons?category=${currentCategory}`
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Icons:', data)
        setIcons(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Error fetching icons:', error)
      })
  }, [currentCategory])

  const copyIconCode = async (path) => {
    try {
      const response = await fetch(path)
      const svg = await response.text()
      await navigator.clipboard.writeText(svg)
      alert('已复制到剪贴板')
    } catch (error) {
      console.error('Error copying icon:', error)
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
          {Array.isArray(categories) && categories.map((category) => (
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
        {icons.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            暂无图标
          </div>
        ) : (
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
                    onClick={() => copyIconCode(icon.path)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    复制代码
                  </button>
                  
                    href={icon.path}
                    download={`${icon.name}.svg`}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 text-center"
                  >
                    下载
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}