import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF转图片 - 在线免费将PDF转为PNG/JPG",
  description:
    "免费在线PDF转图片工具，将PDF每页转为高清PNG或JPG图片，支持自定义分辨率。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["PDF转PNG", "PDF转JPG", "PDF转图片", "PDF to image", "在线PDF转图片"],
};

export default function PdfToImageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
