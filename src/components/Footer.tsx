"use client";

import Link from "next/link";
import { SiteStats } from "@/components/Busuanzi";

const pdfTools = [
  { name: "PDF压缩", href: "/pdf-compress" },
  { name: "PDF转图片", href: "/pdf-to-image" },
  { name: "PDF合并/拆分", href: "/pdf-merge-split" },
];

const imageTools = [
  { name: "图片压缩", href: "/image-compress" },
  { name: "图片转PDF", href: "/image-to-pdf" },
  { name: "图片格式转换", href: "/image-convert" },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                Pure<span className="text-blue-400">Tools</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              你的文件，从不离开你的电脑。<br />
              所有处理在浏览器本地完成，零上传，保护隐私。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">PDF 工具</h3>
            <ul className="space-y-3">
              {pdfTools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-gray-500 hover:text-blue-400 transition-colors duration-200">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">图片工具</h3>
            <ul className="space-y-3">
              {imageTools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-gray-500 hover:text-blue-400 transition-colors duration-200">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">特性</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                隐私安全
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                极速处理
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                完全免费
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col items-center gap-3 text-sm text-gray-600">
          <SiteStats />
          <p>© {new Date().getFullYear()} PureTools. 所有文件处理均在您的浏览器本地完成。</p>
        </div>
      </div>
    </footer>
  );
}
