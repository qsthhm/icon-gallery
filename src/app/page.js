'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Toast 组件
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
      px-6 py-3 bg-gray-800 text-white rounded-lg shadow-xl z-50 
      transition-all duration-300 ease-in-out
      animate-fade-in-up flex items-center gap-2"
    >
      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
};

// 菜单图标组件
const MenuIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white hover:bg-gray-100 
      shadow-md transition-colors duration-200"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
);

// Loading 组件
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin" 
            style={{ animationDirection: 'reverse' }}
          />
        </div>
      </div>
    </div>
  );
}

// 主要内容组件
function IconGallery() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [icons, setIcons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [metadata, setMetadata] = useState({})
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [sortDirection, setSortDirection] = useState('asc')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 从 URL 读取当前分类
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    setCurrentCategory(category)
  }, [searchParams])

  const showToast = (message) => {
    setToast({ visible: true, message });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

  // 加载分类和元数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, metadataRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/metadata')
        ]);

        const categoriesData = await categoriesRes.json();
        const metadataData = await metadataRes.json();
        
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setMetadata(metadataData || {});
      } catch (error) {
        console.error('Failed to load data:', error);
        setCategories([]);
        setMetadata({});
      }
    };

    loadData();
  }, []);

  // 加载图标
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const res = await fetch(`/api/icons${currentCategory === 'all' ? '' : `?category=${currentCategory}`}`);
        const data = await res.json();
        setIcons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load icons:', error);
        setIcons([]);
      }
    };

    loadIcons();
  }, [currentCategory]);

  // 复制图标代码
  const copyIconCode = async (path) => {
    try {
      const response = await fetch(path);
      const svg = await response.text();
      await navigator.clipboard.writeText(svg);
      showToast('复制成功');
    } catch (error) {
      console.error('复制失败:', error);
      showToast('复制失败');
    }
  };

  // 下载图标
  const downloadIcon = async (path, name) => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('下载成功');
    } catch (error) {
      console.error('下载失败:', error);
      showToast('下载失败');
    }
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
    setIsMobileMenuOpen(false)
    
    if (category === 'all') {
      router.push('/')
    } else {
      router.push(`?category=${category}`)
    }
  }

  const sortedCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    
    return [...categories].sort((a, b) => {
      const orderA = metadata[a]?.order || 0;
      const orderB = metadata[b]?.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });
  }, [categories, metadata]);

  const filteredIcons = useMemo(() => {
    if (!Array.isArray(icons)) return [];
    if (!searchTerm) return icons;

    return icons.filter(icon => {
      const iconName = icon.name.replace('.svg', '');
      const categoryMeta = metadata[icon.category] || {};
      const iconMeta = categoryMeta.icons?.[iconName] || {};

      const searchString = [
        iconName,
        icon.category,
        categoryMeta.categoryName,
        iconMeta.name,
        iconMeta.description
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [icons, metadata, searchTerm]);

  const sortedAndFilteredIcons = useMemo(() => {
    let result = [...filteredIcons];

    if (sortDirection !== 'none') {
      result.sort((a, b) => {
        const nameA = a.name.replace('.svg', '').toLowerCase();
        const nameB = b.name.replace('.svg', '').toLowerCase();
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }

    return result;
  }, [filteredIcons, sortDirection]);

  const toggleSort = () => {
    setSortDirection(current => {
      switch (current) {
        case 'none': return 'asc';
        case 'asc': return 'desc';
        case 'desc': return 'none';
        default: return 'asc';
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 移动端菜单按钮 */}
      <MenuIcon onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* 移动端遮罩层 */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 左侧目录 */}
      <aside className={`
        w-64 bg-white p-4 border-r fixed h-screen overflow-y-auto z-30
        transition-transform duration-300 ease-in-out shadow-lg
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Icon Gallery
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            SVG图标管理与预览工具
          </p>
        </div>
        {categories.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            暂无图标分类
          </div>
        ) : (
          <ul className="space-y-1.5">
            <li
              className={`cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                currentCategory === 'all' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              全部图标
            </li>
            {sortedCategories.map(category => (
              <li
                key={category}
                className={`cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentCategory === category 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                <span>{category}</span>
                {metadata[category]?.categoryName && (
                  <span className={`ml-2 ${
                    currentCategory === category ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {metadata[category].categoryName}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 lg:ml-64">
        {/* 标题和描述 */}
        <div className="bg-white border-b px-6 py-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentCategory === 'all' 
              ? '所有图标' 
              : metadata[currentCategory]?.categoryName || currentCategory}
          </h2>
          {currentCategory !== 'all' && metadata[currentCategory]?.description && (
            <p className="text-sm text-gray-600 mt-2">
              {metadata[currentCategory].description}
            </p>
          )}
        </div>

        {/* 搜索栏和工具栏 */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4 border-b">
          <div className="max-w-5xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索图标..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={toggleSort}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors
                ${sortDirection !== 'none' ? 'bg-gray-100' : ''}
                flex items-center gap-2`}
              title="切换排序方式"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h6m-6 4h13" />
              </svg>
              {sortDirection === 'none' && '排序'}
              {sortDirection === 'asc' && 'A → Z'}
              {sortDirection === 'desc' && 'Z → A'}
            </button>
          </div>
        </div>

        {/* 图标网格 */}
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredIcons.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                {searchTerm ? '没有找到匹配的图标' : '暂无图标'}
              </div>
            ) : (
              sortedAndFilteredIcons.map((icon, index) => {
                const iconName = icon.name.replace('.svg', '');
                const categoryMeta = metadata[icon.category] || {};
                const iconMeta = categoryMeta.icons?.[iconName] || {};
                
                return (
                  <div 
                    key={index} 
                    className="p-6 border rounded-xl hover:shadow-lg transition-all duration-200 
                      bg-white hover:scale-102 group"
                  >
                    <div className="flex items-center justify-center mb-4 p-4 bg-gray-50 rounded-lg
                      group-hover:bg-blue-50 transition-colors">
                      <img
                        src={icon.path}
                        alt={iconMeta.name || iconName}
                        className="w-10 h-10 transition-transform group-hover:scale-110"
                      />
                    </div>
                   
                   
<div className="mb-4 text-center space-y-1">
  <p className="font-medium text-gray-800">{iconName}</p>
  {iconMeta.name && (
    <p className="text-sm text-gray-500">{iconMeta.name}</p>
  )}
  {iconMeta.description && (
    <p className="text-xs text-gray-400">{iconMeta.description}</p>
  )}
</div>
<div className="flex justify-center space-x-3">
  <button
    onClick={() => copyIconCode(icon.path)}
    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg
      hover:bg-blue-600 transition-colors flex items-center gap-1"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    复制
  </button>
  <button
    onClick={() => downloadIcon(icon.path, iconName)}
    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg
      hover:bg-green-600 transition-colors flex items-center gap-1"
  >
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    下载
  </button>
</div>
</div>
)
})
)}
</div>
</div>
</main>

{/* Toast 提示 */}
<Toast 
message={toast.message}
visible={toast.visible}
onClose={hideToast}
/>
</div>
);
}

// 导出的主组件
export default function Home() {
return (
<Suspense fallback={<Loading />}>
<IconGallery />
</Suspense>
)
}