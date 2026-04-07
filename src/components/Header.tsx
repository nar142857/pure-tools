"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛠️</span>
            <span className="text-xl font-bold text-blue-600">PureTools</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
              首页
            </Link>
            <Link href="/#tools" className="text-sm text-gray-600 hover:text-blue-600">
              全部工具
            </Link>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              🔒 文件仅在本地处理
            </span>
          </nav>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 text-sm text-gray-600 hover:text-blue-600">
              首页
            </Link>
            <Link href="/#tools" className="block py-2 text-sm text-gray-600 hover:text-blue-600">
              全部工具
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
