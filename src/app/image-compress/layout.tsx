import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "图片压缩 - 在线免费压缩JPG/PNG/WebP",
  description:
    "免费在线图片压缩工具，支持JPG、PNG、WebP格式，批量压缩，可调节压缩质量和尺寸。文件在浏览器本地处理，保护隐私安全。",
  keywords: ["图片压缩", "PNG压缩", "JPG压缩", "WebP压缩", "在线压缩图片", "批量图片压缩"],
};

export default function ImageCompressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
