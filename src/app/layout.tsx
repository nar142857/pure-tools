import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_URL = "https://puretools.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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
    "PDF工具",
    "在线PDF处理",
    "图片处理",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "PureTools - 纯净在线工具",
    description: "你的文件，从不离开你的电脑。免费在线PDF、图片处理工具。",
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
    siteName: "PureTools",
  },
  twitter: {
    card: "summary_large_image",
    title: "PureTools - 纯净在线工具",
    description: "你的文件，从不离开你的电脑。免费在线PDF、图片处理工具。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PureTools",
  url: BASE_URL,
  description: "免费在线PDF、图片处理工具。所有文件在浏览器本地处理，零上传，保护隐私安全。",
  inLanguage: "zh-CN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PureTools",
  url: BASE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
  description: "免费在线PDF压缩、图片压缩、格式转换工具。所有处理在浏览器本地完成，零上传，保护隐私。",
  featureList: [
    "PDF压缩 - 多级压缩减小PDF体积",
    "图片压缩 - JPG/PNG/WebP批量压缩",
    "PDF转图片 - PDF每页转为PNG/JPG",
    "图片转PDF - 多图合并为PDF文档",
    "图片格式转换 - JPG/PNG/WebP互转",
    "PDF合并/拆分 - 合并或拆分PDF文件",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
