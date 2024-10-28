'use client'
import { useState, useEffect, useMemo } from 'react'

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
   <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out">
     {message}
   </div>
 );
};

export default function Home() {
 const [categories, setCategories] = useState([])
 const [currentCategory, setCurrentCategory] = useState('all')
 const [icons, setIcons] = useState([])
 const [searchTerm, setSearchTerm] = useState('')
 const [metadata, setMetadata] = useState({})
 const [toast, setToast] = useState({ visible: false, message: '' })

 // 显示 Toast 的辅助函数
 const showToast = (message) => {
   setToast({ visible: true, message });
 };

 // 隐藏 Toast 的辅助函数
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
       
       console.log('API Response:', {
         categories: categoriesData,
         metadata: metadataData
       });

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

 // 过滤图标
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

 return (
   <div className="flex min-h-screen">
     {/* 左侧目录 */}
     <aside className="w-64 bg-gray-50 p-4 border-r fixed h-screen overflow-y-auto">
       <h2 className="text-xl font-bold mb-4">图标分类</h2>
       {categories.length === 0 ? (
         <div className="text-center text-gray-500 py-8">
           暂无图标分类
         </div>
       ) : (
         <ul className="space-y-2">
           <li
             className={`cursor-pointer p-2 rounded ${
               currentCategory === 'all' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
             }`}
             onClick={() => setCurrentCategory('all')}
           >
             全部图标
           </li>
           {Array.isArray(categories) && categories.map(category => (
             <li
               key={category}
               className={`cursor-pointer p-2 rounded ${
                 currentCategory === category ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
               }`}
               onClick={() => setCurrentCategory(category)}
             >
               <span>{category}</span>
               {metadata[category]?.categoryName && (
                 <span className="text-gray-500 ml-2">
                   {metadata[category].categoryName}
                 </span>
               )}
             </li>
           ))}
         </ul>
       )}
     </aside>

     {/* 主内容区 */}
     <main className="flex-1 ml-64">
       {/* 搜索框 - 固定在顶部 */}
       <div className="sticky top-0 bg-white z-10 p-4 border-b shadow-sm">
         <input
           type="text"
           placeholder="搜索图标..."
           className="w-full p-2 border rounded"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
       </div>

       {/* 图标网格 */}
       <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredIcons.length === 0 ? (
           <div className="col-span-full text-center text-gray-500 py-12">
             {searchTerm ? '没有找到匹配的图标' : '暂无图标'}
           </div>
         ) : (
           filteredIcons.map((icon, index) => {
             const iconName = icon.name.replace('.svg', '');
             const categoryMeta = metadata[icon.category] || {};
             const iconMeta = categoryMeta.icons?.[iconName] || {};
             
             return (
               <div key={index} className="p-4 border rounded hover:shadow-lg">
                 <div className="flex items-center justify-center mb-4">
                   <img
                     src={icon.path}
                     alt={iconMeta.name || iconName}
                     className="w-8 h-8"
                   />
                 </div>
                 <div className="mb-3 text-center">
                   <p className="text-sm font-medium">{iconName}</p>
                   {iconMeta.name && (
                     <p className="text-sm text-gray-500">
                       {iconMeta.name}
                     </p>
                   )}
                   {iconMeta.description && (
                     <p className="text-xs text-gray-400 mt-1">
                       {iconMeta.description}
                     </p>
                   )}
                 </div>
                 <div className="flex justify-center space-x-2">
                   <button
                     onClick={() => copyIconCode(icon.path)}
                     className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                   >
                     复制
                   </button>
                   <button
                     onClick={() => downloadIcon(icon.path, iconName)}
                     className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                   >
                     下载
                   </button>
                 </div>
               </div>
             )
           })
         )}
       </div>
     </main>

     {/* Toast 提示 */}
     <Toast 
       message={toast.message}
       visible={toast.visible}
       onClose={hideToast}
     />
   </div>
 )
}