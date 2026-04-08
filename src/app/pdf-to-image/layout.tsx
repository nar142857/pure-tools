import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/ToolJsonLd";
import { toolSeoMap } from "@/lib/tool-seo";

const seo = toolSeoMap["pdf-to-image"];

export const metadata: Metadata = {
  title: "PDF转图片 - 在线免费将PDF转为PNG/JPG",
  description:
    "免费在线PDF转图片工具，将PDF每页转为高清PNG或JPG图片，支持自定义分辨率。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["PDF转PNG", "PDF转JPG", "PDF转图片", "PDF to image", "在线PDF转图片"],
  alternates: { canonical: "/pdf-to-image" },
  openGraph: {
    title: "PDF转图片 - 在线免费将PDF转为PNG/JPG | PureTools",
    description: "免费在线PDF转图片工具，将PDF每页转为高清PNG或JPG图片，支持自定义分辨率。文件在浏览器本地处理，保护隐私安全。",
    url: "/pdf-to-image",
  },
};

export default function PdfToImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name={seo.name}
        description="免费在线PDF转图片工具，支持PNG/JPG输出，浏览器本地处理"
        url={seo.slug}
        steps={seo.steps}
        faq={seo.faq}
      />
      {children}
    </>
  );
}
