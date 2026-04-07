"use client";

import Link from "next/link";

interface ToolPageLayoutProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolPageLayout({ icon, title, description, children }: ToolPageLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-4xl">{icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">免费</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">🔒 本地处理</span>
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">零上传</span>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
