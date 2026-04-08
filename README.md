# PureTools - 纯净在线文件处理工具

100% 浏览器本地处理，无需上传，保护隐私安全。

## 在线访问

https://puretools.pages.dev/

## 功能列表

| 分类 | 工具 | 说明 |
|------|------|------|
| PDF | PDF 压缩 | 多级压缩，减小文件体积 |
| PDF | PDF 转图片 | 将每页转为 PNG/JPG |
| PDF | PDF 合并/拆分 | 多个 PDF 合并或拆分为单页 |
| 图片 | 图片压缩 | JPG/PNG/WebP 批量压缩 |
| 图片 | 图片转 PDF | 多张图片合并为一个 PDF |
| 图片 | 图片格式转换 | JPG/PNG/WebP 格式互转 |

## 技术栈

- **框架**: Next.js 16 (App Router, Turbopack)
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **部署**: Cloudflare Pages（静态导出）

核心依赖：
- `pdf-lib` — PDF 操作
- `pdfjs-dist` — PDF 渲染
- `jspdf` — PDF 生成

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 http://localhost:3000

## 构建 & 部署

项目使用 `output: "export"` 静态导出，构建产物在 `out/` 目录。

```bash
# 构建
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

## 项目结构

```
src/
├── app/                    # 页面路由
│   ├── page.tsx            # 首页
│   ├── layout.tsx          # 根布局
│   ├── sitemap.ts          # 站点地图
│   ├── pdf-compress/       # PDF 压缩
│   ├── pdf-to-image/       # PDF 转图片
│   ├── pdf-merge-split/    # PDF 合并/拆分
│   ├── image-compress/     # 图片压缩
│   ├── image-to-pdf/       # 图片转 PDF
│   └── image-convert/      # 图片格式转换
├── components/             # 公共组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── FileDropZone.tsx
│   ├── ToolPageLayout.tsx
│   ├── ProcessingStatus.tsx
│   └── ImageCompareSlider.tsx
├── lib/
│   └── tools.ts            # 工具配置与辅助函数
└── empty.ts                # Turbopack 空模块桩（勿删）
```
