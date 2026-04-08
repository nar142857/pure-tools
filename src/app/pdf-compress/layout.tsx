import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/ToolJsonLd";
import { toolSeoMap } from "@/lib/tool-seo";

const seo = toolSeoMap["pdf-compress"];

export const metadata: Metadata = {
  title: "PDF压缩 - 在线免费压缩PDF文件",
  description:
    "免费在线PDF压缩工具，支持轻度/标准/极限多级压缩，减小PDF文件体积。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["PDF压缩", "PDF缩小", "PDF减小体积", "在线PDF压缩", "compress PDF"],
  alternates: { canonical: "/pdf-compress" },
  openGraph: {
    title: "PDF压缩 - 在线免费压缩PDF文件 | PureTools",
    description: "免费在线PDF压缩工具，支持轻度/标准/极限多级压缩，减小PDF文件体积。文件在浏览器本地处理，保护隐私安全。",
    url: "/pdf-compress",
  },
};

export default function PdfCompressLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name={seo.name}
        description="免费在线PDF压缩工具，支持多级压缩，浏览器本地处理"
        url={seo.slug}
        steps={seo.steps}
        faq={seo.faq}
      />
      {children}
    </>
  );
}
