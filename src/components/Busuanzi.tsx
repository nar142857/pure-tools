"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    busuanzi?: {
      site_pv: number;
      site_uv: number;
      page_pv: number;
    };
  }
}

function formatCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1) + "w";
  if (count >= 1000) return (count / 1000).toFixed(1) + "k";
  return String(count);
}

export function PageViews() {
  const [pv, setPv] = useState<number | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.busuanzi) {
          setPv(window.busuanzi.page_pv);
        }
      }, 300);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <span id="busuanzi_container_page_pv" className="inline-flex items-center gap-1 text-xs text-gray-400">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      {pv !== null ? formatCount(pv) : "--"} 次浏览
    </span>
  );
}

export function SiteStats() {
  const [stats, setStats] = useState<{ pv: number; uv: number } | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.busuanzi) {
          setStats({
            pv: window.busuanzi.site_pv,
            uv: window.busuanzi.site_uv,
          });
        }
      }, 300);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <span id="busuanzi_container_site_pv" className="inline-flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        总访问 {stats ? formatCount(stats.pv) : "--"}
      </span>
      <span id="busuanzi_container_site_uv" className="inline-flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        总访客 {stats ? formatCount(stats.uv) : "--"}
      </span>
    </div>
  );
}
