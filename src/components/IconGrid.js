export default function IconGrid({ icons }) {
    if (!icons.length) {
      return (
        <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
          暂无图标
        </div>
      )
    }
  
    return (
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
                  onClick={() => copyIconCode(icon.path)}
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
    )
  }