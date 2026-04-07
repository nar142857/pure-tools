"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200/50 group-hover:shadow-lg group-hover:shadow-blue-300/50 transition-shadow duration-300">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Pure<span className="text-blue-600">Tools</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              首页
            </Link>
            <Link
              href="/#tools"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              全部工具
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium ring-1 ring-emerald-200/50">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              文件仅在本地处理
            </div>
          </nav>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden pb-4 space-y-1">
            <Link
              href="/"
              className="block py-2.5 px-3 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              首页
            </Link>
            <Link
              href="/#tools"
              className="block py-2.5 px-3 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              全部工具
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
