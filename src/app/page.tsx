"use client";

import Link from "next/link";
import { useState } from "react";
import { tools, searchTools } from "@/lib/tools";

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = searchTools(query);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            PureTools
          </h1>
          <p className="text-xl sm:text-2xl font-light mb-2 text-blue-100">
            你的文件，从不离开你的电脑
          </p>
          <p className="text-base text-blue-200 mb-8">
            免费 · 零广告 · 零上传 · 隐私安全
          </p>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="搜索工具... 如：PDF压缩、图片转换"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
      </section>

      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">全部工具</h2>
          <p className="text-gray-500">
            所有工具完全免费，文件仅在浏览器本地处理
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 block"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tool.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      免费
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            没有找到匹配的工具
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">隐私安全</h3>
              <p className="text-sm text-gray-500">
                所有文件在浏览器本地处理，零上传、零服务器接触，您的文件永远不会离开您的设备
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">纯净体验</h3>
              <p className="text-sm text-gray-500">
                零广告、零弹窗、零强制注册，拖拽即用，零学习成本
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-semibold text-gray-900 mb-2">真正免费</h3>
              <p className="text-sm text-gray-500">
                核心功能完全免费，无文件大小限制，无使用次数限制
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
