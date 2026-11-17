import { Heart, Coffee, Sparkles } from "lucide-react"
import { ContactInfo } from "./ContactInfo"
import Link from "next/link"
import { donateLinks } from "@/config/donate"
import { siteLinks } from "@/config/site"
import contact from "@/data/contact.json"

const githubRepo = (() => {
  const url = contact.github || ""
  return /your[-_]|example\.(com|org|net)/i.test(url) ? "" : url
})()

export function Footer() {
  const currentYear = new Date().getFullYear()
  const hasDonate = Boolean(donateLinks.buyMeACoffee || donateLinks.koFi)

  return (
    <footer className="bg-[rgb(var(--color-muted))] border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Prompt Việt</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Prompt tiếng Việt cho ChatGPT, Gemini và Google Workspace. Không cần đăng nhập,
              không có bản trả phí.
            </p>
            <ContactInfo variant="footer" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Liên kết nhanh</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors">
                Trang chủ
              </Link>
              <Link href="/support" className="block text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors">
                Ủng hộ dự án
              </Link>
              {siteLinks.blogUrl && (
                <a href={siteLinks.blogUrl} target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors">
                  Blog TyAuto
                </a>
              )}
              {githubRepo && (
                <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors">
                  Mã nguồn trên GitHub
                </a>
              )}
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Ủng hộ</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Trang này tốn tiền tên miền và hosting. Nếu nó tiết kiệm thời gian cho bạn, ủng hộ một ly cà phê.
            </p>
            {hasDonate ? (
              <div className="flex items-center gap-4">
                {donateLinks.buyMeACoffee && (
                  <a
                    href={donateLinks.buyMeACoffee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Coffee className="w-5 h-5" />
                    <span className="text-sm">Mua cho tôi một ly cà phê</span>
                  </a>
                )}
                {donateLinks.koFi && (
                  <a
                    href={donateLinks.koFi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">Ko-fi</span>
                  </a>
                )}
              </div>
            ) : (
              <Link
                href="/support"
                className="text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Xem các cách ủng hộ Prompt Việt
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Prompt Việt. Được xây dựng với
              <span className="flex items-center gap-1 ml-1">
                <Heart className="w-4 h-4 text-red-500" />
                Next.js + Tailwind + Cloudflare Pages
              </span>
            </p>
            <div className="flex items-center gap-4">
              {githubRepo && (
                <a
                  href={githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}