"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { tools, searchTools } from "@/lib/tools";

const categoryLabels: Record<string, string> = {
  pdf: "PDF 工具",
  image: "图片工具",
  other: "其他",
};

const categoryColors: Record<string, string> = {
  pdf: "from-rose-500 to-orange-400",
  image: "from-violet-500 to-indigo-400",
  other: "from-emerald-500 to-teal-400",
};

const categoryBadgeColors: Record<string, string> = {
  pdf: "bg-rose-50 text-rose-600 ring-rose-200",
  image: "bg-violet-50 text-violet-600 ring-violet-200",
  other: "bg-emerald-50 text-emerald-600 ring-emerald-200",
};

const toolIcons: Record<string, React.ReactNode> = {
  "pdf-compress": (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6M9.5 15.5L12 13l2.5 2.5M12 13v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "image-compress": (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M21 15l-5-5L5 21M3 16l4-4 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "pdf-to-image": (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 13h2m-2 3h3M8 19h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "image-to-pdf": (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "image-convert": (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "pdf-merge-split": (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M8 4H5a2 2 0 00-2 2v2m5 12H5a2 2 0 01-2-2v-2M16 4h3a2 2 0 012 2v2m-5 12h3a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => searchTools(query), [query]);
  const grouped = useMemo(() => {
    const map = new Map<string, typeof tools>();
    for (const tool of filtered) {
      const cat = tool.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(tool);
    }
    return map;
  }, [filtered]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/40 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/30 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[80px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-blue-200 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% 浏览器本地处理，无需上传
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Pure
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-blue-100/80 mb-3 font-light max-w-2xl mx-auto leading-relaxed">
            免费在线 PDF 压缩、图片压缩、格式转换工具
          </p>
          <p className="text-base text-blue-200/50 mb-10">
            浏览器本地处理 · 零上传 · 零广告 · 保护隐私安全
          </p>

          <div className="max-w-lg mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-cyan-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工具... 如：PDF压缩、图片转换"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder:text-gray-400 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-base transition-shadow duration-300 focus:shadow-blue-500/20"
              />
              <svg
                className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {[...grouped.entries()].map(([category, categoryTools]) => (
          <div key={category} className="mb-14 last:mb-0">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${categoryColors[category] || categoryColors.other}`} />
              <h2 className="text-2xl font-bold text-gray-900">
                {categoryLabels[category] || category}
              </h2>
              <span className="text-sm text-gray-400 ml-1">{categoryTools.length} 个工具</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[tool.category] || categoryColors.other} flex items-center justify-center text-white shadow-lg shadow-gray-200/50 group-hover:scale-110 transition-transform duration-300`}>
                        {toolIcons[tool.id]}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full ring-1 ${categoryBadgeColors[tool.category] || categoryBadgeColors.other}`}>
                        {categoryLabels[tool.category]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600/0 group-hover:text-blue-600 transition-all duration-300">
                      开始使用
                      <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">没有找到匹配的工具</p>
            <p className="text-gray-300 text-sm mt-1">尝试其他关键词搜索</p>
          </div>
        )}
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">为什么选择 PureTools</h2>
            <p className="text-gray-500 max-w-lg mx-auto">专注于极致简洁与绝对安全的文件处理体验</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "隐私安全",
                desc: "所有文件在浏览器本地处理，零上传、零服务器接触，您的文件永远不会离开您的设备",
                gradient: "from-emerald-500 to-teal-500",
                shadow: "shadow-emerald-200/50",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "极速体验",
                desc: "零广告、零弹窗、零注册，拖拽即用，先进的 Web 技术保障处理速度",
                gradient: "from-amber-500 to-orange-500",
                shadow: "shadow-amber-200/50",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "真正免费",
                desc: "核心功能完全免费，无文件大小限制，无使用次数限制，无隐藏收费",
                gradient: "from-rose-500 to-pink-500",
                shadow: "shadow-rose-200/50",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative group bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.shadow} shadow-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
