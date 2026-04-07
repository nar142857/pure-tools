import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF合并/拆分 - 在线免费合并或拆分PDF",
  description:
    "免费在线PDF合并拆分工具，支持多个PDF合并为一个，或将PDF拆分为单页。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["PDF合并", "PDF拆分", "合并PDF", "拆分PDF", "merge PDF", "split PDF"],
};

export default function PdfMergeSplitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
