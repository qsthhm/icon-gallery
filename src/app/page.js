'use client'
import { useState, useEffect, useMemo } from 'react'

export default function Home() {
 const [categories, setCategories] = useState([])
 const [currentCategory, setCurrentCategory] = useState('all')
 const [icons, setIcons] = useState([])
 const [searchTerm, setSearchTerm] = useState('')
 const [metadata, setMetadata] = useState({})
 const [selectedColor, setSelectedColor] = useState('#000000')

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
       
       console.log('Loaded data:', { categories: categoriesData, metadata: metadataData });
       
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
       console.log('Loaded icons:', data);
       setIcons(Array.isArray(data) ? data : []);
     } catch (error) {
       console.error('Failed to load icons:', error);
       setIcons([]);
     }
   };

   loadIcons();
 }, [currentCategory]);

 // 复制图标代码
 const copyIconCode = async (path, color) => {
   try {
     const response = await fetch(path);
     let svg = await response.text();
     if (color && color !== '#000000') {
       svg = svg.replace(/fill="[^"]*"/g, `fill="${color}"`);
       if (!svg.includes('fill=')) {
         svg = svg.replace('<svg', `<svg fill="${color}"`);
       }
     }
     await navigator.clipboard.writeText(svg);
     alert('复制成功！');
   } catch (error) {
     console.error('复制失败:', error);
     alert('复制失败');
   }
 };

 // 过滤图标
 const filteredIcons = useMemo(() => {
   console.log('Current metadata:', metadata);
   console.log('Current icons:', icons);
   console.log('Search term:', searchTerm);

   if (!Array.isArray(icons)) return [];
   if (!searchTerm) return icons;

   return icons.filter(icon => {
     const iconName = icon.name.replace('.svg', '');
     const categoryMeta = metadata[icon.category] || {};
     const iconMeta = categoryMeta.icons?.[iconName] || {};
     
     const searchItems = [
       iconName,
       iconMeta.name,
       iconMeta.description,
       categoryMeta.categoryName
     ];
     
     const searchString = searchItems
       .filter(Boolean)
       .join(' ')
       .toLowerCase();

     const searchTermLower = searchTerm.toLowerCase();
     
     // 详细的调试信息
     console.log({
       icon: icon.name,
       category: icon.category,
       metadata: iconMeta,
       searchString,
       searchTerm: searchTermLower,
       items: searchItems,
       matched: searchString.includes(searchTermLower)
     });

     return searchString.includes(searchTermLower);
   });
 }, [icons, metadata, searchTerm]);

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
         {Array.isArray(categories) && categories.map(category => (
           <li
             key={category}
             className={`cursor-pointer p-2 rounded ${
               currentCategory === category ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
             }`}
             onClick={() => setCurrentCategory(category)}
           >
             {metadata[category]?.categoryName || category}
           </li>
         ))}
       </ul>
     </aside>

     <main className="flex-1 p-6">
       <div className="mb-6 flex gap-4">
         <input
           type="text"
           placeholder="搜索图标..."
           className="flex-1 p-2 border rounded"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
         <div className="flex items-center gap-2">
           <label htmlFor="color">填充颜色:</label>
           <input
             type="color"
             id="color"
             value={selectedColor}
             onChange={(e) => setSelectedColor(e.target.value)}
             className="w-12 h-8 cursor-pointer"
           />
         </div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         {filteredIcons.map((icon, index) => {
           const iconName = icon.name.replace('.svg', '');
           const categoryMeta = metadata[icon.category] || {};
           const iconMeta = categoryMeta.icons?.[iconName] || {};
           
           return (
             <div key={index} className="p-4 border rounded hover:shadow-lg">
               <div className="h-16 flex items-center justify-center mb-2">
                 <img
                   src={icon.path}
                   alt={iconMeta.name || iconName}
                   className="w-8 h-8"
                   style={{ 
                     filter: selectedColor !== '#000000' 
                       ? `brightness(0) saturate(100%) invert(1) drop-shadow(0 0 0 ${selectedColor})`
                       : 'none'
                   }}
                 />
               </div>
               <p className="text-sm text-center mb-1">
                 {iconMeta.name || iconName}
               </p>
               {iconMeta.description && (
                 <p className="text-xs text-gray-500 text-center mb-2">
                   {iconMeta.description}
                 </p>
               )}
               <button
                 onClick={() => copyIconCode(icon.path, selectedColor)}
                 className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
               >
                 复制代码
               </button>
             </div>
           )
         })}
       </div>
     </main>
   </div>
 )
}