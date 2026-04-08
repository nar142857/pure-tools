import type { Metadata } from "next";
import { ToolJsonLd } from "@/components/ToolJsonLd";
import { toolSeoMap } from "@/lib/tool-seo";

const seo = toolSeoMap["pdf-merge-split"];

export const metadata: Metadata = {
  title: "PDF合并/拆分 - 在线免费合并或拆分PDF",
  description:
    "免费在线PDF合并拆分工具，支持多个PDF合并为一个，或将PDF拆分为单页。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["PDF合并", "PDF拆分", "合并PDF", "拆分PDF", "merge PDF", "split PDF"],
  alternates: { canonical: "/pdf-merge-split" },
  openGraph: {
    title: "PDF合并/拆分 - 在线免费合并或拆分PDF | PureTools",
    description: "免费在线PDF合并拆分工具，支持多个PDF合并为一个，或将PDF拆分为单页。文件在浏览器本地处理，保护隐私安全。",
    url: "/pdf-merge-split",
  },
};

export default function PdfMergeSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name={seo.name}
        description="免费在线PDF合并拆分工具，浏览器本地处理"
        url={seo.slug}
        steps={seo.steps}
        faq={seo.faq}
      />
      {children}
    </>
  );
}
