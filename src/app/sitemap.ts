import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://puretools.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    { url: `${BASE_URL}/pdf-compress`, name: "PDF压缩" },
    { url: `${BASE_URL}/image-compress`, name: "图片压缩" },
    { url: `${BASE_URL}/pdf-to-image`, name: "PDF转图片" },
    { url: `${BASE_URL}/image-to-pdf`, name: "图片转PDF" },
    { url: `${BASE_URL}/image-convert`, name: "图片格式转换" },
    { url: `${BASE_URL}/pdf-merge-split`, name: "PDF合并/拆分" },
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: tool.url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
