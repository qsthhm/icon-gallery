// src/types/metadata.ts

// 图标元数据
interface IconMetadata {
    name: string;           // 图标中文名称
    description?: string;   // 图标描述
    order?: number;         // 排序权重
  }
  
  // 分类元数据
  interface CategoryMetadata {
    categoryName: string;   // 分类中文名称
    order?: number;        // 分类排序权重
    description?: string;  // 分类描述
    icons: {
      [key: string]: IconMetadata;
    }
  }
  
  // 完整的元数据结构
  interface Metadata {
    [category: string]: CategoryMetadata;
  }
  
  export type { IconMetadata, CategoryMetadata, Metadata };