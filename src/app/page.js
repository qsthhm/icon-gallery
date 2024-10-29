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
      bg-neutral-800 text-neutral-100 rounded-lg shadow-xl z-50 
      transition-all duration-300 ease-in-out animate-fade-in-up
      max-w-[90vw] md:max-w-md text-center">
      {message}
    </div>
  );
};

// 代码复制按钮组件
const CopyButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-2xl transform transition-all">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-neutral-100 rounded-lg">
              <img src={icon.path} alt={iconMeta.name || iconName} className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">{iconName}</p>
              <p className="text-sm text-neutral-500">{iconMeta.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col gap-3 md:w-48">
            <button
              onClick={() => onCopy(icon.path)}
              className="flex-1 px-4 py-2 flex items-center justify-center gap-2 
                text-sm bg-neutral-900 text-white rounded-lg 
                hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制图标
            </button>
            <button
              onClick={() => onDownload(icon.path, iconName)}
              className="flex-1 px-4 py-2 flex items-center justify-center gap-2 
                text-sm border border-neutral-200 rounded-lg 
                hover:bg-neutral-50 transition-colors"
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
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === 'svg' 
                      ? 'bg-neutral-100 text-neutral-900' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setActiveTab('svg')}
                >
                  SVG
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === 'vue' 
                      ? 'bg-neutral-100 text-neutral-900' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setActiveTab('vue')}
                >
                  Vue
                </button>
              </div>
              <CopyButton onClick={copyCode} />
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 h-[200px] border border-neutral-200">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <code 
                    className="font-mono text-sm block min-w-0 w-full cursor-pointer"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
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
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-neutral-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-neutral-900 rounded-full animate-spin" 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 从 URL 读取当前分类
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    setCurrentCategory(category)
  }, [searchParams])

  // Mobile menu close on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentCategory])

  const showToast = (message) => {
    setToast({ visible: true, message });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '' });
  };

  // 加载数据和其他函数保持不变...

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 移动端顶部导航 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">Icon Gallery</h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端菜单抽屉 */}
      <div className={`lg:hidden fixed inset-0 z-30 transition-all duration-300 ${
        mobileMenuOpen ? "visible" : "invisible"
      }`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-30" : "opacity-0"
        }`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-16 left-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <nav className="p-4">
            {/* 导航内容... */}
          </nav>
        </div>
      </div>

      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:block w-64 fixed h-screen overflow-y-auto bg-white border-r">
        <div className="p-6 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-neutral-900">Icon Gallery</h1>
          <p className="text-sm text-neutral-600 mt-2">SVG图标管理与预览工具</p>
        </div>
        <nav className="p-4">
          {/* 导航内容... */}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {/* 搜索栏 */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b">
          <div className="px-4 lg:px-6 py-4">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索图标..."
                  className="w-full pl-10 pr-10 py-2 bg-white border border-neutral-300 
                    rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 
                    outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* 搜索图标和清除按钮... */}
              </div>
              {/* 排序按钮... */}
            </div>
          </div>
        </div>

        {/* 图标网格 */}
        <div className="px-4 lg:px-6 py-6">
          {groupedIcons.map(group => group.icons.length > 0 && (
            <div key={group.category} className="mb-12">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                {group.categoryName || group.category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {group.icons.map((icon, index) => (
                  <div
                    key={index}
                    className="aspect-square p-4 rounded-lg cursor-pointer
                      bg-white border border-neutral-200 
                      hover:border-neutral-300 hover:shadow-md
                      transition-all duration-200"
                    onClick={() => setSelectedIcon(icon)}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-2 rounded-lg bg-neutral-50">
                        <img
                          src={icon.path}
                          alt={iconMeta.name || iconName}
                          className="w-8 h-8"
                        />
                      </div>
                      <p className="text-sm font-medium text-neutral-900 truncate w-full">
                        {iconName}
                      </p>
                      {iconMeta.name && (
                        <p className="text-xs text-neutral-500 truncate w-full">
                          {iconMeta.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modals & Toast */}
      {selectedIcon && (
        <IconModal
          icon={selectedIcon}
          metadata={metadata}
          onClose={() => setSelectedIcon(null)}
          onCopy={copyIconCode}
          onDownload={downloadIcon}
        />
      )}
      <Toast 
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <IconGallery />
    </Suspense>
  )
}