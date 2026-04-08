import { toolSeoMap } from "@/lib/tool-seo";

const BASE_URL = "https://puretools.com";

export async function GET() {
  const toolSections = Object.entries(toolSeoMap)
    .map(([key, seo]) => {
      const stepsText = seo.steps
        .map((s, i) => `  ${i + 1}. ${s.name}: ${s.text}`)
        .join("\n");
      const faqText = seo.faq
        .map((f) => `  Q: ${f.question}\n  A: ${f.answer}`)
        .join("\n\n");

      return `## ${seo.name}

- URL: ${BASE_URL}${seo.slug}
- 功能描述：${seo.name}在线工具

### 使用步骤
${stepsText}

### 常见问题
${faqText}`;
    })
    .join("\n\n");

  const content = `# PureTools - 纯净在线工具

> 免费在线文件处理工具集。所有文件在浏览器本地处理，零上传，保护隐私安全。
> 网站: ${BASE_URL}

## 关于 PureTools

PureTools 是一个完全免费的在线文件处理工具网站。

核心优势：
- 隐私安全：所有文件在浏览器本地处理，零上传、零服务器接触，文件永远不会离开用户设备
- 极速体验：零广告、零弹窗、零注册，拖拽即用，先进的 Web 技术保障处理速度
- 完全免费：核心功能完全免费，无文件大小限制，无使用次数限制，无隐藏收费

技术实现：
- 所有文件处理在浏览器端通过 WebAssembly 和 Canvas API 完成
- 使用 pdf-lib 和 pdfjs-dist（Mozilla PDF.js）处理 PDF
- 无后端服务器，无数据库，用户数据不离开设备

## 工具列表

${toolSections}

## 联系与支持

- 网站：${BASE_URL}
- 所有工具完全免费，无需注册即可使用
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
