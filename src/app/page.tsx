"use client"

import { Search, Filter, Sparkles, MessageSquare, ArrowRight, Heart, ExternalLink, BookOpen } from "lucide-react"
import { Github } from "@/components/CustomIcons"
import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import { prompts, platforms as allPlatforms, type Prompt } from "@/data"
import { SearchFilter } from "@/components/SearchFilter"
import { PromptCard } from "@/components/PromptCard"
import { ContactInfo } from "@/components/ContactInfo"
import { SupportSection } from "@/components/SupportSection"
import { siteLinks } from "@/config/site"

const ITEMS_PER_PAGE = 50

/** Icon cho từng danh mục. Danh mục mới không có trong map vẫn dùng icon mặc định. */
const CATEGORY_EMOJI: Record<string, string> = {
  "Ảnh - GPT Image": "🖼️",
  "Ảnh - Nano Banana": "🍌",
  "Video - ASMR": "🎬",
  "Xây dựng": "🏗️",
  "Bất động sản": "🏠",
  "Nội thất": "🛋️",
  "Sức khoẻ": "💚",
  "Học tập": "📚",
  "Công việc": "💼",
  "Phân tích dữ liệu": "📊",
  "Content Marketing": "📢",
  "Lập trình": "💻",
  "Dịch thuật": "🌐",
  "AI Skills": "🤖",
}

const emojiFor = (category: string) => CATEGORY_EMOJI[category] ?? "📝"

/** Đọc filter từ URL (?category=&platform=) để link chia sẻ / back-forward hoạt động. */
function readFilterFromUrl(param: string, allowed: string[]): string {
  if (typeof window === "undefined") return "all"
  const value = new URLSearchParams(window.location.search).get(param)
  return value && allowed.includes(value) ? value : "all"
}

/** Trả về chuỗi query (?category=&platform=) cho bộ lọc hiện tại; "" nếu không lọc gì. */
function filterQuery(category: string, platform: string) {
  const params = new URLSearchParams()
  if (category && category !== "all") params.set("category", category)
  if (platform && platform !== "all") params.set("platform", platform)
  const query = params.toString()
  return query ? `/?${query}` : "/"
}

export default function Home() {
  const categories = useMemo(() => ["all", ...new Set(prompts.map((p) => p.category))], [])
  const platforms = useMemo(() => ["all", ...allPlatforms], [])

  // Lift category/platform state to parent so sidebar links can control filter.
  // Khởi tạo "all" rồi đọc URL trong effect: đọc window ngay trong useState sẽ lệch
  // giữa server (không có window) và client -> hydration mismatch, mất filter khi
  // mở link chia sẻ (?category=...).
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [filterReady, setFilterReady] = useState(false)

  // 1) mount: URL -> state. Chạy trong setTimeout để không set state đồng bộ ngay
  // trong effect (tránh cascading render); cũng không đọc window trong useState vì
  // server không có window -> hydration mismatch, mất ?category khi mở link chia sẻ.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setSelectedCategory(readFilterFromUrl("category", categories))
      setSelectedPlatform(readFilterFromUrl("platform", platforms))
      setFilterReady(true)
    }, 0)
    return () => window.clearTimeout(id)
  }, [categories, platforms])

  // Handle filter changes from SearchFilter
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts)

  // Pagination
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  // Mỗi lần bộ lọc ra kết quả mới thì quay về trang đầu.
  // Đặt ở đây (event do SearchFilter phát ra) thay vì useEffect để tránh render dây chuyền.
  const handleFilterChange = useCallback((filtered: Prompt[]) => {
    setFilteredPrompts(filtered)
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  // 2) state -> URL: dùng history.replaceState nhưng truyền lại history.state của
  // Next. Truyền null sẽ xoá router state nội bộ của App Router -> mọi <Link> sau đó
  // điều hướng xong bị đưa về "/". (router.replace() không cập nhật URL ở trang
  // static export này.)
  useEffect(() => {
    if (!filterReady) return
    const target = filterQuery(selectedCategory, selectedPlatform)
    const current = window.location.pathname + window.location.search
    if (current !== target) window.history.replaceState(window.history.state, "", target)
  }, [filterReady, selectedCategory, selectedPlatform])

  // Back/forward của trình duyệt -> state
  useEffect(() => {
    const onPopState = () => {
      setSelectedCategory(readFilterFromUrl("category", categories))
      setSelectedPlatform(readFilterFromUrl("platform", platforms))
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [categories, platforms])

  /**
   * Chọn danh mục: bấm lại danh mục đang chọn = bỏ lọc (giống hành vi chip trên mobile).
   * Chỉ cuộn khi lưới kết quả đang nằm ngoài khung nhìn, tránh giật trang khi user đang xem.
   */
  const selectCategory = useCallback((category: string) => {
    setSelectedCategory((current) => (current === category ? "all" : category))
    const grid = document.getElementById("prompt-grid")
    if (!grid) return
    // Mobile: giữ hàng chip trong tầm nhìn; desktop: cuộn tới lưới kết quả.
    const chips = document.getElementById("category-chips")
    const target = chips && chips.offsetParent !== null ? chips : grid
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect()
      const outOfView = rect.top > window.innerHeight * 0.5 || rect.bottom < 0
      if (outOfView) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    })
  }, [])

  return (
    <main className="flex-1 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-28 bg-[rgb(var(--color-background))] border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6 animate-in">
              <span className="badge badge-outline border-[rgb(var(--color-accent)/0.35)] text-[rgb(var(--color-accent-700))]">
                Bản beta · cập nhật 11/2026
              </span>
            </div>
            <h1 className="heading-1 text-foreground mb-6 animate-in delay-1 text-balance">
              Thư viện prompt <span className="italic text-[rgb(var(--color-accent-700))]">tiếng Việt</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8 max-w-2xl animate-in delay-2 text-pretty">
              {prompts.length} prompt mình viết và chỉnh lại cho tiếng Việt, dùng được với ChatGPT, Gemini
              và Google Workspace. Chọn danh mục, bấm sao chép, dán vào ô chat.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-in delay-3">
              <Link
                href="#prompts"
                className="btn btn-lg btn-primary"
              >
                Xem {prompts.length} prompt
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/support"
                className="btn btn-lg btn-outline border-border text-foreground hover:bg-[rgb(var(--color-muted))]"
              >
                <Heart className="w-4 h-4" />
                Ủng hộ dự án
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm animate-in delay-4">
              {siteLinks.githubRepo && (
                <span className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <a href={siteLinks.githubRepo} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Mã nguồn mở
                  </a>
                </span>
              )}
              {siteLinks.blogUrl && (
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <a href={siteLinks.blogUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Blog TyAuto
                  </a>
                </span>
              )}
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <a href={siteLinks.inspiration} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Dựa trên prompts.chat
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-4 sm:py-8 border-b border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-8 text-center">
            <StatItem value={prompts.length} label="Prompt có sẵn" icon={MessageSquare} />
            <StatItem value={categories.length - 1} label="Danh mục" icon={Filter} />
            <StatItem value={platforms.length - 1} label="Nền tảng" icon={Sparkles} />
            <StatItem value="0đ" label="Không cần đăng ký" icon={Heart} />
          </div>
        </div>
      </section>

      {/* Prompts Section */}
      <section id="prompts" className="section bg-background">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
            <div>
              <h2 className="heading-2 mb-2">Toàn bộ prompt</h2>
              <p className="body text-muted-foreground">
                Sắp theo danh mục. Bấm vào thẻ để đọc đầy đủ hoặc sao chép luôn.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {siteLinks.githubRepo && (
                <Link
                  href={siteLinks.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-md btn-secondary"
                >
                  <Github className="w-4 h-4" />
                  Đóng góp prompt
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Search & Filter */}
            <aside className="lg:col-span-1 space-y-6">
              <SearchFilter
                onFilterChange={handleFilterChange}
                controlledCategory={selectedCategory}
                controlledPlatform={selectedPlatform}
                onCategoryChange={setSelectedCategory}
                onPlatformChange={setSelectedPlatform}
              />

              <div className="card hidden lg:block">
                <h3 className="heading-4 mb-4">Danh mục</h3>
                <ul className="space-y-1">
                  {categories.filter((c: string) => c !== "all").map((cat: string) => {
                    const active = selectedCategory === cat
                    return (
                      <li key={cat}>
                        <button
                          type="button"
                          onClick={() => selectCategory(cat)}
                          aria-pressed={active}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            active
                              ? "text-primary bg-[rgb(var(--color-primary)/0.1)] dark:bg-[rgb(var(--color-primary)/0.2)] font-medium"
                              : "text-muted-foreground hover:text-primary hover:bg-muted"
                          }`}
                        >
                          <span className="mr-2" aria-hidden="true">{emojiFor(cat)}</span>
                          {cat}
                          <span className="float-right text-xs opacity-60">
                            {prompts.filter(p => p.category === cat).length}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="mt-3 w-full btn btn-sm btn-ghost gap-1 text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))]"
                  >
                    ✕ Bỏ lọc
                  </button>
                )}
              </div>

              <ContactInfo variant="default" className="mt-2 hidden lg:block" />
            </aside>

            {/* Main - Prompt Grid */}
            <div className="lg:col-span-3">
              {/* Danh mục dạng chip cuộn ngang — chỉ trên mobile */}
              <div className="lg:hidden mb-6 scroll-mt-20" id="category-chips">
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory("all"); setSelectedPlatform("all") }}
                    aria-pressed={selectedCategory === "all"}
                    className={`shrink-0 snap-start whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "bg-[rgb(var(--color-primary))] text-white border-[rgb(var(--color-primary))]"
                        : "border-[rgb(var(--color-border))] text-muted-foreground hover:border-[rgb(var(--color-primary))]"
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.filter((c: string) => c !== "all").map((cat: string) => {
                    const active = selectedCategory === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className={`shrink-0 snap-start whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition-colors ${
                          active
                            ? "bg-[rgb(var(--color-primary))] text-white border-[rgb(var(--color-primary))]"
                            : "border-[rgb(var(--color-border))] text-muted-foreground hover:border-[rgb(var(--color-primary))]"
                        }`}
                        aria-pressed={active}
                      >
                        <span aria-hidden="true">{emojiFor(cat)}</span> {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 scroll-mt-24" id="prompt-grid">
                {filteredPrompts.slice(0, visibleCount).map((prompt: Prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>

              <p className="sr-only" aria-live="polite">
                Đang hiển thị {filteredPrompts.length} prompt
              </p>

              {filteredPrompts.length === 0 && (
                <div className="card text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <p className="body text-muted-foreground">Không có prompt nào khớp. Bỏ bớt bộ lọc, hoặc thử từ khoá ngắn hơn như email hay ảnh.</p>
                </div>
              )}

              {/* Load More Button */}
              {visibleCount < filteredPrompts.length && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="btn btn-lg btn-primary gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Xem thêm {Math.min(ITEMS_PER_PAGE, filteredPrompts.length - visibleCount)} prompt
                    <span className="text-sm opacity-70">({visibleCount}/{filteredPrompts.length})</span>
                  </button>
                </div>
              )}

              {visibleCount >= filteredPrompts.length && filteredPrompts.length > 0 && (
                <p className="text-center text-muted-foreground mt-10 body-sm">
                  Đã hiển thị tất cả {filteredPrompts.length} prompt
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-[rgb(var(--color-muted))] border border-[rgb(var(--color-accent)/0.25)] rounded-lg">
        <div className="container text-center">
          <h2 className="heading-2 mb-4 text-foreground">Góp prompt của bạn</h2>
          <p className="body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bạn có prompt dùng hằng ngày và thấy nó tiết kiệm thời gian? Gửi qua GitHub, tên bạn sẽ nằm ngay trên thẻ prompt đó.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {siteLinks.githubRepo && (
              <Link
                href={siteLinks.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-primary"
              >
                <Github className="w-5 h-5" />
                Tạo Pull Request
              </Link>
            )}
            {siteLinks.githubIssues && (
              <Link
                href={siteLinks.githubIssues}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-outline border-border text-foreground hover:bg-[rgb(var(--color-background))]"
              >
                <Sparkles className="w-5 h-5" />
                Đề xuất prompt mới
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <SupportSection />
    </main>
  )
}

function StatItem({
  value,
  label,
  icon: Icon,
}: {
  value: number | string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="p-2 sm:p-4 animate-in">
      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 bg-primary/10 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}