import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PureTools - 纯净在线工具 | 你的文件，从不离开你的电脑",
    template: "%s | PureTools",
  },
  description:
    "PureTools 提供免费的在线 PDF 转换、图片压缩、格式转换、文件处理工具。所有文件在浏览器本地处理，零上传，保护您的隐私安全。",
  keywords: [
    "PDF压缩",
    "图片压缩",
    "PDF转图片",
    "图片转PDF",
    "图片格式转换",
    "PDF合并",
    "PDF拆分",
    "在线工具",
    "免费工具",
    "隐私安全",
  ],
  openGraph: {
    title: "PureTools - 纯净在线工具",
    description: "你的文件，从不离开你的电脑。免费在线PDF、图片处理工具。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
