import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/ToolJsonLd";
import { toolSeoMap } from "@/lib/tool-seo";

const seo = toolSeoMap["image-convert"];

export const metadata: Metadata = {
  title: "图片格式转换 - 在线免费JPG/PNG/WebP互转",
  description:
    "免费在线图片格式转换工具，支持JPG、PNG、WebP格式互转，批量处理，可调节输出质量。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["PNG转JPG", "WebP转PNG", "JPG转PNG", "图片格式转换", "image format converter"],
  alternates: { canonical: "/image-convert" },
  openGraph: {
    title: "图片格式转换 - 在线免费JPG/PNG/WebP互转 | PureTools",
    description: "免费在线图片格式转换工具，支持JPG、PNG、WebP格式互转，批量处理，可调节输出质量。文件在浏览器本地处理，保护隐私安全。",
    url: "/image-convert",
  },
};

export default function ImageConvertLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name={seo.name}
        description="免费在线图片格式转换工具，JPG/PNG/WebP互转，浏览器本地处理"
        url={seo.slug}
        steps={seo.steps}
        faq={seo.faq}
      />
      {children}
    </>
  );
}
