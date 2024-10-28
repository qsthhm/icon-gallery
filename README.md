# Icon Gallery - 基于 Claude AI 开发的 SVG 图标管理工具

> 本项目完全基于与 Claude AI 的对话完成开发，展示了 AI 辅助开发的能力。

## 项目简介

Icon Gallery 是一个简洁易用的 SVG 图标管理和预览工具，支持分类浏览、搜索、复制和下载。项目采用 Next.js 14 和 Tailwind CSS 构建，并部署在 Vercel 平台上。

## 开发过程

整个开发过程都是通过与 Claude AI 的对话完成的。主要开发步骤包括：

1. **项目初始化**
  - 基础项目搭建
  - 目录结构设计
  - 技术栈选择

2. **核心功能实现**
  - 图标展示和分类
  - 搜索功能
  - 复制和下载功能
  - 排序功能

3. **UI/UX 优化**
  - 响应式布局
  - 交互体验改进
  - 样式美化

4. **部署和文档**
  - Vercel 部署
  - 文档编写

## 技术栈

- Next.js 14
- React
- Tailwind CSS
- Vercel

## 项目结构

├── public/
│   └── icons/              # SVG 图标目录
│       ├── social/         # 分类目录示例
│       │   ├── metadata.json  # 分类元数据
│       │   └── twitter.svg    # SVG 图标文件
│       └── others/         # 其他分类
├── src/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── layout.js      # 布局文件
│   │   └── page.js        # 主页面
│   ├── data/
│   │   └── metadata/      # 元数据配置文件
│   └── types/             # TypeScript 类型定义（可选）


## 核心功能

1. **图标管理**
   - 分类展示
   - 支持手动排序
   - 中英文名称支持

2. **搜索功能**
   - 支持中英文搜索
   - 实时过滤
   - 分类筛选

3. **交互功能**
   - 一键复制 SVG 代码
   - 下载 SVG 文件
   - Toast 提示

4. **个性化配置**
   - 自定义分类顺序
   - 自定义图标信息
   - 支持详细描述

## 配置说明

### Metadata 配置

```json
{
  "categoryName": "分类名称",
  "order": 1,
  "description": "分类描述",
  "icons": {
    "icon-name": {
      "name": "图标中文名",
      "description": "图标描述",
      "order": 1
    }
  }
}
```

示例（social.json）：
```json
{
  "categoryName": "社交媒体",
  "order": 1,
  "description": "社交媒体相关图标",
  "icons": {
    "twitter": {
      "name": "推特",
      "description": "推特社交平台图标",
      "order": 1
    },
    "facebook": {
      "name": "脸书",
      "description": "Facebook社交平台图标",
      "order": 2
    }
  }
}
```
配置字段说明：

categoryName: 分类的中文名称（必填）
order: 分类排序权重，数字越小越靠前（可选）
description: 分类描述（可选）
icons: 包含所有图标的元数据（必填）

key: 对应 svg 文件名（不含后缀）
name: 图标中文名称（必填）
description: 图标描述（可选）
order: 图标排序权重，数字越小越靠前（可选）



注意事项：

metadata 文件必须使用 UTF-8 编码保存
图标的 key 必须和实际的 svg 文件名匹配（不含.svg后缀）
order 字段不提供时会按名称字母顺序排序
description 字段为可选，用于显示额外信息

目录结构
