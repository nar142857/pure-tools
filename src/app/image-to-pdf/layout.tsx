import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/ToolJsonLd";
import { toolSeoMap } from "@/lib/tool-seo";

const seo = toolSeoMap["image-to-pdf"];

export const metadata: Metadata = {
  title: "图片转PDF - 在线免费将图片合并为PDF",
  description:
    "免费在线图片转PDF工具，多张图片合并为一个PDF文档，支持A4/Letter页面和自定义方向。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["图片转PDF", "JPG转PDF", "多图合并PDF", "image to PDF", "在线图片转PDF"],
  alternates: { canonical: "/image-to-pdf" },
  openGraph: {
    title: "图片转PDF - 在线免费将图片合并为PDF | PureTools",
    description: "免费在线图片转PDF工具，多张图片合并为一个PDF文档，支持A4/Letter页面和自定义方向。文件在浏览器本地处理，保护隐私安全。",
    url: "/image-to-pdf",
  },
};

export default function ImageToPdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name={seo.name}
        description="免费在线图片转PDF工具，多图合并，浏览器本地处理"
        url={seo.slug}
        steps={seo.steps}
        faq={seo.faq}
      />
      {children}
    </>
  );
}
