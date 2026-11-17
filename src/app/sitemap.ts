import { MetadataRoute } from "next"
import { prompts } from "@/data"
import { siteUrl } from "@/config/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl
  const lastModified = new Date()

  const staticRoutes = [
    "",
    "/support",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Sinh từ dữ liệu thật: thêm prompt vào prompts.json là sitemap tự cập nhật,
  // không còn danh sách id hard-code bị lệch (link chết trong sitemap).
  const promptRoutes = prompts.map((prompt) => ({
    url: `${baseUrl}/prompt/${prompt.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...promptRoutes]
}