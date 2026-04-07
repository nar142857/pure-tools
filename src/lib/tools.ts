export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: "pdf" | "image" | "other";
  keywords: string[];
}

export const tools: ToolConfig[] = [
  {
    id: "pdf-compress",
    name: "PDF压缩",
    description: "多级压缩PDF文件，减小文件体积",
    icon: "📄",
    href: "/pdf-compress",
    category: "pdf",
    keywords: ["PDF压缩", "PDF缩小", "compress PDF", "reduce PDF size"],
  },
  {
    id: "image-compress",
    name: "图片压缩",
    description: "压缩JPG/PNG/WebP图片，支持批量处理",
    icon: "🖼️",
    href: "/image-compress",
    category: "image",
    keywords: ["图片压缩", "PNG压缩", "JPG压缩", "compress image"],
  },
  {
    id: "pdf-to-image",
    name: "PDF转图片",
    description: "将PDF每页转为PNG/JPG图片",
    icon: "📑",
    href: "/pdf-to-image",
    category: "pdf",
    keywords: ["PDF转PNG", "PDF转JPG", "PDF to image"],
  },
  {
    id: "image-to-pdf",
    name: "图片转PDF",
    description: "多张图片合并为一个PDF文档",
    icon: "📎",
    href: "/image-to-pdf",
    category: "image",
    keywords: ["图片转PDF", "JPG转PDF", "image to PDF"],
  },
  {
    id: "image-convert",
    name: "图片格式转换",
    description: "JPG/PNG/WebP格式互转，支持批量",
    icon: "🔄",
    href: "/image-convert",
    category: "image",
    keywords: ["PNG转JPG", "WebP转PNG", "image format converter"],
  },
  {
    id: "pdf-merge-split",
    name: "PDF合并/拆分",
    description: "合并多个PDF或拆分为单页",
    icon: "✂️",
    href: "/pdf-merge-split",
    category: "pdf",
    keywords: ["PDF合并", "PDF拆分", "merge PDF", "split PDF"],
  },
];

export function searchTools(query: string): ToolConfig[] {
  if (!query.trim()) return tools;
  const q = query.toLowerCase();
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
