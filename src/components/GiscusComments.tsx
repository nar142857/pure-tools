"use client";

import { useEffect, useRef } from "react";

const GISCUS_CONFIG = {
  repo: "nar142857/comment",
  repoId: "R_kgDOM2UOpQ",
  category: "General",
  categoryId: "DIC_kwDOM2UOpc4CivUE",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
  loading: "lazy",
};

interface GiscusCommentsProps {
  mapping?: string;
}

export function GiscusComments({ mapping }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", mapping || GISCUS_CONFIG.mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata);
    script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
    script.setAttribute("data-theme", GISCUS_CONFIG.theme);
    script.setAttribute("data-lang", GISCUS_CONFIG.lang);
    script.setAttribute("data-loading", GISCUS_CONFIG.loading);
    script.crossOrigin = "anonymous";

    ref.current.innerHTML = "";
    ref.current.appendChild(script);
  }, [mapping]);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        评论与反馈
      </h3>
      <div ref={ref} />
    </div>
  );
}
