"use client"

import { Heart, Coffee, QrCode, Copy, Check, Banknote, Smartphone, Users, Info } from "lucide-react"
import { Github } from "@/components/CustomIcons"
import { useState } from "react"
import { cn, copyText } from "@/lib/utils"
import { ContactInfo } from "@/components/ContactInfo"
import { QRCodeItem } from "@/components/QRCodeItem"
import { GoogleFormEmbed } from "@/components/GoogleFormEmbed"
import { siteLinks } from "@/config/site"
import {
  donateBank,
  donateLinks,
  donateNotice,
  donateWallet,
  bankInfoLines,
  bankQrSrc,
  walletInfoLines,
  walletQrSrc,
  hasBankInfo,
  hasWalletInfo,
  hasAnyDonationMethod,
} from "@/config/donate"

export default function SupportPageClient() {
  const [copied, setCopied] = useState<string | null>(null)

  const bankReady = hasBankInfo()
  const walletReady = hasWalletInfo()
  const walletPhone = donateWallet.phone.replace(/[\s.-]/g, "")
  const anyMethod = hasAnyDonationMethod()

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyText(text)
    setCopied(ok ? label : null)
    if (ok) setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="flex-1">
      <section className="relative bg-[rgb(var(--color-background))] py-20 lg:py-28 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-[rgb(var(--color-accent)/0.35)] text-[rgb(var(--color-accent-700))] rounded-full mb-6">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6 text-foreground">
            Ủng hộ <span className="italic text-[rgb(var(--color-accent-700))]">Prompt Việt</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Tiền ủng hộ trả cho tên miền, hosting và thời gian viết prompt mới. Không có gói premium, mọi prompt đều mở.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {anyMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {donateLinks.buyMeACoffee && (
                <SupportCard
                  icon={Coffee}
                  title="Mua cho tôi một ly cà phê"
                  description="Ủng hộ một ly cà phê để duy trì dự án"
                  actionLabel="Ủng hộ ngay"
                  actionHref={donateLinks.buyMeACoffee}
                  color="amber"
                />
              )}
              {donateLinks.koFi && (
                <SupportCard
                  icon={Heart}
                  title="Ủng hộ qua Ko-fi"
                  description="Đóng góp một lần hoặc hàng tháng"
                  actionLabel="Ủng hộ ngay"
                  actionHref={donateLinks.koFi}
                  color="pink"
                />
              )}
              {bankReady && (
                <SupportCard
                  icon={Banknote}
                  title="Chuyển khoản ngân hàng"
                  description={`${donateBank.bankName} - Nội địa miễn phí`}
                  actionLabel="Sao chép số TK"
                  onAction={() => handleCopy(donateBank.accountNumber, "bank")}
                  copied={copied === "bank"}
                  color="green"
                />
              )}
              {walletReady && (
                <SupportCard
                  icon={Smartphone}
                  title="MoMo / ZaloPay"
                  description={walletPhone ? "Quét QR hoặc chuyển theo SĐT" : "Quét mã QR MoMo để ủng hộ"}
                  actionLabel={walletPhone ? "Sao chép SĐT" : ""}
                  onAction={walletPhone ? () => handleCopy(donateWallet.phone, "momo") : undefined}
                  copied={copied === "momo"}
                  color="purple"
                />
              )}
            </div>
          )}

          {bankReady && (
            <div className="bg-card rounded-xl border border-border p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                Thông tin chuyển khoản
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Ngân hàng</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-3 py-1 rounded text-sm text-foreground font-mono">{donateBank.bankName}</code>
                    <button
                      onClick={() => handleCopy(donateBank.bankName, "bankname")}
                      className="p-1.5 hover:bg-border rounded transition-colors"
                      aria-label="Sao chép tên ngân hàng"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-3 py-1 rounded text-sm text-foreground font-mono tracking-wide">{donateBank.accountNumber}</code>
                    <button
                      onClick={() => handleCopy(donateBank.accountNumber, "bankacc")}
                      className="p-1.5 hover:bg-border rounded transition-colors"
                      aria-label="Sao chép số tài khoản"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Chủ tài khoản</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-3 py-1 rounded text-sm text-foreground font-mono">{donateBank.accountName}</code>
                    <button
                      onClick={() => handleCopy(donateBank.accountName, "bankowner")}
                      className="p-1.5 hover:bg-border rounded transition-colors"
                      aria-label="Sao chép tên chủ tài khoản"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>
                {donateBank.transferNote && (
                  <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-accent-50))] dark:bg-[rgb(var(--color-accent-900)/0.35)] rounded-lg border border-[rgb(var(--color-accent)/0.3)]">
                    <span className="text-muted-foreground">Nội dung chuyển khoản</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-3 py-1 rounded text-sm text-foreground font-mono">{donateBank.transferNote}</code>
                      <button
                        onClick={() => handleCopy(donateBank.transferNote, "banknote")}
                        className="p-1.5 hover:bg-border rounded transition-colors"
                        aria-label="Sao chép nội dung chuyển khoản"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <QrCode className="w-5 h-5" />
                          Mã QR chuyển khoản
                        </h3>
                        {bankReady || walletReady ? (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {bankReady && (
                                <QRCodeItem
                                  title={donateBank.bankName || "Chuyển khoản ngân hàng"}
                                  qrSrc={bankQrSrc()}
                                  info={bankInfoLines()}
                                />
                              )}
                              {walletReady && (
                                <QRCodeItem title="MoMo / ZaloPay" qrSrc={walletQrSrc()} info={walletInfoLines()} />
                              )}
                            </div>
                            {donateBank.transferNote && (
                              <div className="mt-6 p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                  <strong className="text-foreground">Lưu ý:</strong> Hãy thêm nội dung "
                                  {donateBank.transferNote}" khi chuyển khoản để chúng tôi dễ theo dõi.
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted p-4">
                            <Info className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {donateNotice ||
                                "Thông tin nhận ủng hộ (số tài khoản, mã QR) đang được cập nhật. Trong lúc chờ, bạn có thể đóng góp bằng cách chia sẻ hoặc góp ý prompt mới."}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-card rounded-xl border border-border p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Github className="w-5 h-5" />
                          Đóng góp theo cách khác
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">Chia sẻ cho bạn bè, đồng nghiệp</p>
                              <p className="text-sm">Gửi link trang web, embed prompt vào bài viết, video</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">Góp ý prompt mới</p>
                              <p className="text-sm">
                                {siteLinks.githubIssues ? (
                                  <>
                                    Tạo <a href={siteLinks.githubIssues} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--color-accent-700))] dark:text-[rgb(var(--color-accent-400))] hover:underline">GitHub Issue</a> hoặc Pull Request
                                  </>
                                ) : (
                                  "Gửi góp ý qua biểu mẫu khảo sát hoặc liên hệ trực tiếp"
                                )}
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">Báo lỗi, đề xuất tính năng</p>
                              <p className="text-sm">Mở issue trên GitHub, mình đọc hết</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">Viết bài review, giới thiệu</p>
                              <p className="text-sm">Trên blog, LinkedIn, Facebook, YouTube cá nhân</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">Đóng góp mã nguồn</p>
                              <p className="text-sm">Next.js, Tailwind, TypeScript - mọi PR đều hoan nghênh</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mb-12">
                      <GoogleFormEmbed
                        formUrl="https://forms.gle/oyQSRfMe794JVeoRA"
                        title="Khảo sát chất lượng Prompt Việt"
                        description="Góp ý 2 phút giúp thư viện prompt tiếng Việt tốt hơn. Mọi phản hồi đều được đọc kỹ."
                      />
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6 mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Người ủng hộ
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Danh sách những người đã đóng góp cho Prompt Việt. Cảm ơn mọi người!
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm">
                          Bạn có thể là người đầu tiên!
                        </span>
                      </div>
                      {donateLinks.githubSponsors && (
                        <p className="mt-4 text-sm text-muted-foreground">
                          Mọi đóng góp tài chính đều được công khai minh bạch tại{" "}
                          <a
                            href={donateLinks.githubSponsors}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[rgb(var(--color-accent-700))] dark:text-[rgb(var(--color-accent-400))] hover:underline"
                          >
                            GitHub Sponsors
                          </a>
                          .
                        </p>
                      )}
                    </div>

                    <ContactInfo variant="default" className="mb-8" />

                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        Cảm ơn bạn đã đồng hành cùng Prompt Việt!
                        <Heart className="inline w-4 h-4 text-red-500 align-middle ml-1" />
                      </p>
                    </div>
                  </div>
                </section>
              </main>
            )
          }

function SupportCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  copied,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel: string
  actionHref?: string
  onAction?: () => void
  copied?: boolean
  color: string
}) {
  // One card treatment for every method — the icon carries the accent, not four competing hues.
  const colorClasses = {
    amber: "bg-card border-border",
    pink: "bg-card border-border",
    green: "bg-card border-border",
    purple: "bg-card border-border",
  }

  const iconColors = {
    amber: "text-[rgb(var(--color-accent-700))] bg-[rgb(var(--color-accent-100))] dark:text-[rgb(var(--color-accent-400))] dark:bg-[rgb(var(--color-accent-900)/0.35)]",
    pink: "text-[rgb(var(--color-accent-700))] bg-[rgb(var(--color-accent-100))] dark:text-[rgb(var(--color-accent-400))] dark:bg-[rgb(var(--color-accent-900)/0.35)]",
    green: "text-[rgb(var(--color-accent-700))] bg-[rgb(var(--color-accent-100))] dark:text-[rgb(var(--color-accent-400))] dark:bg-[rgb(var(--color-accent-900)/0.35)]",
    purple: "text-[rgb(var(--color-accent-700))] bg-[rgb(var(--color-accent-100))] dark:text-[rgb(var(--color-accent-400))] dark:bg-[rgb(var(--color-accent-900)/0.35)]",
  }

  const buttonColors = {
    amber: "bg-primary hover:bg-primary-hover text-primary-foreground",
    pink: "bg-primary hover:bg-primary-hover text-primary-foreground",
    green: "bg-primary hover:bg-primary-hover text-primary-foreground",
    purple: "bg-primary hover:bg-primary-hover text-primary-foreground",
  }

  return (
    <div className={cn("rounded-xl border p-6 text-center", colorClasses[color as keyof typeof colorClasses])}>
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4", iconColors[color as keyof typeof iconColors])}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      {actionHref ? (
        <a
          href={actionHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors", buttonColors[color as keyof typeof buttonColors])}
        >
          {actionLabel}
        </a>
      ) : onAction ? (
        <button
          onClick={onAction}
          className={cn("inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors w-full", buttonColors[color as keyof typeof buttonColors])}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Đã copy
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {actionLabel}
            </>
          )}
        </button>
      ) : null}
    </div>
  )
}

