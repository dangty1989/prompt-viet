/**
 * Thông tin site / social links.
 *
 * Tất cả link công khai đọc từ env để không còn URL giả (github.com, your-profile...)
 * bị commit vào code. Nếu env trống thì component tương ứng tự ẩn phần tử đó.
 */

const str = (value: string | undefined): string => (typeof value === "string" ? value.trim() : "")

/** Regex nhận diện URL còn là placeholder (chưa cấu hình thật). */
const PLACEHOLDER = /your[-_]|example\.(com|org|net)|placeholder|repo-name|username/i

const githubRepo = str(process.env.NEXT_PUBLIC_GITHUB_REPO_URL)

/**
 * URL gốc của site, dùng cho metadataBase / sitemap / robots / canonical.
 * Đổi domain (Cloudflare Pages, Vercel, domain riêng) chỉ cần set
 * NEXT_PUBLIC_SITE_URL rồi build lại — không sửa code.
 */
export const siteUrl = (
  str(process.env.NEXT_PUBLIC_SITE_URL) || "https://prompt-viet.vercel.app"
).replace(/\/+$/, "")

export const siteLinks = {
  /** Link tới repo GitHub của dự án. Rỗng => không render các mục "Mã nguồn mở". */
  githubRepo,
  githubIssues: githubRepo ? `${githubRepo}/issues/new` : "",
  /**
   * Blog của TyAuto — hiện ở navbar, footer và sidebar contact.
   * Set NEXT_PUBLIC_BLOG_URL để đổi; mặc định là domain chính của TyAuto.
   */
  blogUrl: (str(process.env.NEXT_PUBLIC_BLOG_URL) || "https://tyauto.name.vn").replace(/\/+$/, ""),
  /** Link repo tham khảo (prompts.chat) — dùng để ghi nguồn, không phải placeholder. */
  inspiration: "https://github.com/f/prompts.chat",
}

export const isPlaceholderLink = (href: string): boolean => !href || PLACEHOLDER.test(href)