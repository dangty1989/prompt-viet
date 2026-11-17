import { MetadataRoute } from "next"
import { siteUrl } from "@/config/site"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/*.json$"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}