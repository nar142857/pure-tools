# PureTools 搜索引擎优化（SEO）与 AI 搜索优化（AEO）

## 一、优化概览

| 维度 | 状态 | 说明 |
|------|------|------|
| Meta 标签（title/description/keywords） | ✅ 已完成 | 全局 + 6 个子页面独立配置 |
| Canonical URL | ✅ 已完成 | 所有页面均设置规范链接 |
| OpenGraph | ✅ 已完成 | 首页 + 子页面独立 OG 标签 |
| Twitter Card | ✅ 已完成 | summary_large_image 类型 |
| robots.txt | ✅ 已完成 | 允许爬取，排除无关路径 |
| sitemap.xml | ✅ 已完成 | 动态生成，含所有页面 |
| JSON-LD 结构化数据 | ✅ 已完成 | 首页 + 子页面多类型结构化数据 |
| AI 搜索优化（llms.txt） | ✅ 已完成 | 静态 llms.txt + 动态 llms-full.txt |
| og:image 社交分享图 | ❌ 待完成 | 需制作 1200x630 图片 |
| Google Search Console 提交 | ❌ 待完成 | 需手动操作 |

---

## 二、传统 SEO 配置

### 2.1 Meta 标签配置

**根布局**（`src/app/layout.tsx`）：

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://puretools.com"),
  title: {
    default: "PureTools - 纯净在线工具 | 你的文件，从不离开你的电脑",
    template: "%s | PureTools",  // 子页面 title 会自动拼接
  },
  description: "PureTools 提供免费的在线 PDF 转换、图片压缩、格式转换、文件处理工具...",
  keywords: ["PDF压缩", "图片压缩", "PDF转图片", ...],
  alternates: { canonical: "https://puretools.com" },
  openGraph: { ... },
  twitter: { card: "summary_large_image", ... },
  robots: { index: true, follow: true, googleBot: { ... } },
};
```

**各工具子页面**（`src/app/*/layout.tsx`）：

| 页面 | title | canonical |
|------|-------|-----------|
| `/pdf-compress` | PDF压缩 - 在线免费压缩PDF文件 | `/pdf-compress` |
| `/image-compress` | 图片压缩 - 在线免费压缩JPG/PNG/WebP | `/image-compress` |
| `/pdf-to-image` | PDF转图片 - 在线免费将PDF转为PNG/JPG | `/pdf-to-image` |
| `/image-to-pdf` | 图片转PDF - 在线免费将图片合并为PDF | `/image-to-pdf` |
| `/image-convert` | 图片格式转换 - 在线免费JPG/PNG/WebP互转 | `/image-convert` |
| `/pdf-merge-split` | PDF合并/拆分 - 在线免费合并或拆分PDF | `/pdf-merge-split` |

### 2.2 JSON-LD 结构化数据

#### 首页（全局）

| 类型 | Schema.org Type | 作用 |
|------|----------------|------|
| 网站信息 | `WebSite` | 含站内搜索配置（SearchAction） |
| 软件应用 | `SoftwareApplication` | 含功能列表、免费价格标记 |

#### 各工具子页面

每个工具页通过 `ToolJsonLd` 组件注入三种结构化数据：

| 类型 | Schema.org Type | 作用 |
|------|----------------|------|
| Web 应用 | `WebApplication` | 标记为免费在线工具应用 |
| 使用教程 | `HowTo` | 分步骤描述工具使用流程 |
| 常见问题 | `FAQPage` | FAQ 问答对，有机会在搜索结果中展示 |

**数据来源**：`src/lib/tool-seo.ts` 集中管理所有工具的 SEO 数据（步骤 + FAQ），各 layout 通过 key 引用。

**组件**：`src/components/ToolJsonLd.tsx` 负责渲染 JSON-LD script 标签。

### 2.3 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/static/
Disallow: /_next/image/

Sitemap: https://puretools.com/sitemap.xml
```

- `Disallow` 排除无 SEO 价值的路径，节省爬取预算
- Sitemap 指向动态生成的 sitemap.xml

### 2.4 sitemap.xml

通过 `src/app/sitemap.ts` 动态生成，包含：
- 首页（priority: 1, changeFrequency: weekly）
- 6 个工具页（priority: 0.8, changeFrequency: monthly）

---

## 三、AI 搜索优化（AEO）

### 3.1 llms.txt（静态文件）

路径：`public/llms.txt`，部署后可通过 `https://puretools.com/llms.txt` 访问。

这是 [llms.txt 提案标准](https://llmstxt.org/)，让 ChatGPT、Claude、Perplexity 等 AI 搜索引擎能快速理解网站内容。

内容包括：
- 网站概述和核心特点
- 6 个工具的名称、URL、功能描述
- 技术实现说明
- 统一使用流程

### 3.2 llms-full.txt（动态生成）

路径：`src/app/llms-full.txt/route.ts`，通过 Next.js Route Handler 动态生成。

部署后可通过 `https://puretools.com/llms-full.txt` 访问。

在 llms.txt 基础上额外包含：
- 每个工具的详细使用步骤
- 每个工具的 FAQ 问答
- 数据来源于 `src/lib/tool-seo.ts`

**新增工具时**，只需在 `tool-seo.ts` 中添加条目，llms-full.txt 会自动更新。

---

## 四、文件结构

```
src/
├── app/
│   ├── layout.tsx              # 全局 Metadata + 首页 JSON-LD
│   ├── page.tsx                # 首页（语义化文案）
│   ├── sitemap.ts              # 动态 sitemap.xml
│   ├── llms-full.txt/
│   │   └── route.ts            # AI 搜索完整内容（动态）
│   ├── pdf-compress/
│   │   └── layout.tsx          # PDF压缩 Metadata + JSON-LD
│   ├── image-compress/
│   │   └── layout.tsx          # 图片压缩 Metadata + JSON-LD
│   ├── pdf-to-image/
│   │   └── layout.tsx          # PDF转图片 Metadata + JSON-LD
│   ├── image-to-pdf/
│   │   └── layout.tsx          # 图片转PDF Metadata + JSON-LD
│   ├── image-convert/
│   │   └── layout.tsx          # 图片格式转换 Metadata + JSON-LD
│   └── pdf-merge-split/
│       └── layout.tsx          # PDF合并/拆分 Metadata + JSON-LD
├── components/
│   └── ToolJsonLd.tsx          # 工具页 JSON-LD 渲染组件
└── lib/
    └── tool-seo.ts             # 工具 SEO 数据（步骤 + FAQ）

public/
├── robots.txt                  # 爬虫配置
└── llms.txt                    # AI 搜索内容描述（静态）
```

---

## 五、新增工具时的 SEO 操作清单

添加新工具时，需要同步更新以下文件：

1. **`src/app/[新工具]/layout.tsx`** — 添加独立 Metadata（title、description、keywords、canonical、openGraph）和 ToolJsonLd 组件
2. **`src/app/[新工具]/page.tsx`** — 工具页面本身
3. **`src/lib/tools.ts`** — 在 tools 数组中添加工具配置
4. **`src/lib/tool-seo.ts`** — 在 toolSeoMap 中添加步骤和 FAQ 数据
5. **`src/app/sitemap.ts`** — 在 tools 数组中添加新页面
6. **`src/components/Footer.tsx`** — 在对应分类中添加站内链接
7. **`public/llms.txt`** — 手动添加新工具描述

---

## 六、待办事项

- [ ] 制作 og:image 社交分享图（1200x630px），添加到 OpenGraph 和 Twitter Card 配置
- [ ] 在 [Google Search Console](https://search.google.com/search-console) 中验证站点并提交 sitemap.xml
- [ ] 使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 验证结构化数据
- [ ] 使用 [Schema Markup Validator](https://validator.schema.org/) 验证 JSON-LD
- [ ] 监控 Google Search Console 中的索引状态和搜索表现
- [ ] 考虑添加 `hreflang` 标签（如有国际化计划）
