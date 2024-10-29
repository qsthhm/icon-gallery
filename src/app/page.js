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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 
      bg-gray-800 text-white rounded-lg shadow-xl z-50 
      transition-all duration-300 ease-in-out animate-fade-in-up">
      {message}
    </div>
  );
};

// 代码复制按钮组件
const CopyButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
    title="复制代码"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  </button>
)

// 图标详情弹窗组件
const IconModal = ({ icon, metadata, onClose, onCopy, onDownload }) => {
  const [activeTab, setActiveTab] = useState('svg')
  const [svgCode, setSvgCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const iconName = icon.name.replace('.svg', '')
  const categoryMeta = metadata[icon.category] || {}
  const iconMeta = categoryMeta.icons?.[iconName] || {}

  // 获取实际的SVG代码
  useEffect(() => {
    const fetchSvgCode = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(icon.path);
        const code = await response.text();
        setSvgCode(code);
      } catch (error) {
        console.error('Failed to fetch SVG code:', error);
        setSvgCode('');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSvgCode();
  }, [icon.path]);

  const copyCode = async () => {
    const code = activeTab === 'svg' ? svgCode : `<${iconName} :size="32" />`;
    await navigator.clipboard.writeText(code);
  }

  const selectCode = (e) => {
    const range = document.createRange();
    range.selectNodeContents(e.target);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 border shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <img src={icon.path} alt={iconMeta.name || iconName} className="w-12 h-12" />
            <div>
              <p className="font-medium">{iconName}</p>
              <p className="text-sm text-gray-500">{iconMeta.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-6">
          <div className="flex-none space-y-3">
            <button
              onClick={() => onCopy(icon.path)}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制图标
            </button>
            <button
              onClick={() => onDownload(icon.path, iconName)}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载图标
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 text-sm rounded-lg ${
                    activeTab === 'svg' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('svg')}
                >
                  SVG
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-lg ${
                    activeTab === 'vue' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('vue')}
                >
                  Vue
                </button>
              </div>
              <CopyButton onClick={copyCode} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 h-[200px]">
  {isLoading ? (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  ) : (
    <div className="h-full overflow-y-auto">
      <code 
        className="font-mono text-sm block min-w-0 w-full cursor-pointer"
        style={{
          whiteSpace: 'pre-wrap',       /* 保留空格和换行符，自动换行 */
          wordBreak: 'break-all',       /* 允许在任意字符间断行 */
          wordWrap: 'break-word',       /* 对长单词换行 */
          overflowWrap: 'break-word'    /* 确保长单词换行 */
        }}
        onClick={selectCode}
      >
        {activeTab === 'svg' ? svgCode : `<${iconName} :size="32" />`}
      </code>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

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

  // 切换分类时更新 URL
  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
    if (category === 'all') {
      router.push('/')
    } else {
      router.push(`?category=${category}`)
    }
  }

  // 切换排序方向
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

  // 对分类进行排序
  const sortedCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    
    return [...categories].sort((a, b) => {
      const orderA = metadata[a]?.order || 0;
      const orderB = metadata[b]?.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });
  }, [categories, metadata]);

  // 对图标进行排序和分组
  const groupedIcons = useMemo(() => {
    if (!Array.isArray(icons)) return [];
    
    // 先进行搜索过滤
    const filteredIcons = searchTerm 
      ? icons.filter(icon => {
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
        })
      : icons;

    // 进行排序
    const sortedIcons = [...filteredIcons];
    if (sortDirection !== 'none') {
      sortedIcons.sort((a, b) => {
        const nameA = a.name.replace('.svg', '').toLowerCase();
        const nameB = b.name.replace('.svg', '').toLowerCase();
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }

    // 按分类分组
    return sortedCategories.map(category => ({
      category,
      categoryName: metadata[category]?.categoryName,
      icons: sortedIcons.filter(icon => icon.category === category)
    }));
  }, [icons, sortedCategories, metadata, searchTerm, sortDirection]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 左侧导航栏 */}
      <aside className="w-64 bg-white fixed h-screen overflow-y-auto border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Icon Gallery
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            SVG图标管理与预览工具
          </p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                  currentCategory === 'all' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                <span className="block font-medium">全部分类</span>
              </button>
            </li>
            {sortedCategories.map(category => (
              <li key={category}>
                <button
                  className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                    currentCategory === category 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  <span className="block font-medium">{category}</span>
                  {metadata[category]?.categoryName && (
                    <span className="block text-sm text-gray-500">
                      {metadata[category].categoryName}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 py-6">
        {/* 搜索栏和排序按钮 */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b shadow-sm">
          <div className="px-6 py-4">
            <div className="max-w-5xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索图标..."
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                {searchTerm && (
                  <button
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
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
        </div>

        {/* 图标组展示 */}
        {groupedIcons.every(group => group.icons.length === 0) ? (
          <div className="px-6 py-12 text-center text-gray-500">
            无结果，请切换全部分类或更换关键词
          </div>
        ) : (
          groupedIcons.map(group => group.icons.length > 0 && (
            <div key={group.category} className="mb-12">
              <div className="px-6 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {group.categoryName || group.category}
                </h2>
              </div>
              <div className="px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6">
                {group.icons.map((icon, index) => {
                  const iconName = icon.name.replace('.svg', '')
                  const iconMeta = metadata[group.category]?.icons?.[iconName] || {}
                  
                  return (
                    <div
                      key={index}
                      className={`aspect-square p-4 rounded-lg cursor-pointer transition-colors
                        ${selectedIcon === icon ? 'bg-white' : 'hover:bg-gray-100'}
                      `}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <img
                          src={icon.path}
                          alt={iconMeta.name || iconName}
                          className="w-8 h-8"
                        />
                        <p className="text-sm font-medium truncate w-full">
                          {iconName}
                        </p>
                        {iconMeta.name && (
                          <p className="text-xs text-gray-500 truncate w-full">
                            {iconMeta.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </main>

      {/* 图标详情弹窗 */}
      {selectedIcon && (
        <IconModal
          icon={selectedIcon}
          metadata={metadata}
          onClose={() => setSelectedIcon(null)}
          onCopy={copyIconCode}
          onDownload={downloadIcon}
        />
      )}

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