# Icon Gallery

一个简洁易用的 SVG 图标管理和预览工具，支持分类浏览、搜索、复制和下载。


## 功能特点

- 🗂️ 分类管理：支持多级目录分类
- 🔍 智能搜索：支持英文名称和中文描述搜索
- 📋 一键复制：快速复制 SVG 代码
- ⬇️ 便捷下载：下载单个 SVG 文件
- 📱 响应式设计：支持各种设备屏幕

## 在线演示

[查看演示](https://icon-gallery-two.vercel.app)

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install

### 目录结构
├── public/
│   └── icons/              # SVG图标目录
│       ├── social/         # 分类目录示例
│       │   ├── metadata.json  # 分类元数据
│       │   └── twitter.svg    # SVG图标文件
│       └── other/          # 其他分类
├── src/
│   ├── app/
│   │   ├── api/           # API路由
│   │   └── page.js        # 主页面
│   ├── data/
│   │   └── metadata/      # 元数据文件
│   └── ...




