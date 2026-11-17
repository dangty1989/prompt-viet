"use client"

import { Heart, Coffee, QrCode, Copy, Check, Banknote, Smartphone, Info } from "lucide-react"
import { Github } from "@/components/CustomIcons"
import { useState } from "react"
import { cn, copyText } from "@/lib/utils"
import { ContactInfo } from "./ContactInfo"
import { QRCodeItem } from "./QRCodeItem"
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

export function SupportSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyText(text)
    setCopied(ok ? label : null)
    if (ok) setTimeout(() => setCopied(null), 2000)
  }

  const bankReady = hasBankInfo()
  const walletReady = hasWalletInfo()
  const walletPhone = donateWallet.phone.replace(/[\s.-]/g, "")
  const anyMethod = hasAnyDonationMethod()
  const showQrBlock = bankReady || walletReady

  return (
    <section className="section-lg bg-gradient-to-b from-muted/50 to-background">
      <div className="container">
        <div className="text-center mb-12 animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgb(var(--color-destructive)/0.1)] rounded-full mb-4 text-[rgb(var(--color-destructive))]">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="heading-2 mb-2">Ủng hộ dự án</h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tiền ủng hộ trả cho tên miền, hosting và thời gian viết prompt mới. Không có gói premium,
            mọi prompt đều mở.
          </p>
        </div>

        {anyMethod && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {donateLinks.buyMeACoffee && (
              <SupportCard
                icon={Coffee}
                title="Mua cho tôi một ly cà phê"
                description="Ủng hộ một ly cà phê để duy trì dự án"
                actionLabel="Ủng hộ ngay"
                actionHref={donateLinks.buyMeACoffee}
                variant="accent"
              />
            )}
            {donateLinks.koFi && (
              <SupportCard
                icon={Heart}
                title="Ủng hộ qua Ko-fi"
                description="Đóng góp một lần hoặc hàng tháng"
                actionLabel="Ủng hộ ngay"
                actionHref={donateLinks.koFi}
                variant="destructive"
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
                variant="success"
              />
            )}
            {walletReady && (
              <SupportCard
                icon={Smartphone}
                title="MoMo / ZaloPay"
                description={walletPhone ? "Quét QR hoặc chuyển theo SĐT" : "Quét mã QR MoMo để ủng hộ"}
                actionLabel={walletPhone ? "Copy SĐT" : ""}
                onAction={walletPhone ? () => handleCopy(donateWallet.phone, "momo") : undefined}
                copied={copied === "momo"}
                variant="primary"
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="heading-4 mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Mã QR chuyển khoản
            </h3>
            {showQrBlock ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bankReady && (
                  <QRCodeItem
                    title={donateBank.bankName || "Chuyển khoản ngân hàng"}
                    qrSrc={bankQrSrc()}
                    info={bankInfoLines()}
                  />
                )}
                {walletReady && (
                  <QRCodeItem
                    title="MoMo / ZaloPay"
                    qrSrc={walletQrSrc()}
                    info={walletInfoLines()}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
                <Info className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                <p className="body-sm text-muted-foreground">
                  {donateNotice ||
                    "Thông tin nhận ủng hộ (số tài khoản, mã QR) đang được cập nhật. Trong lúc chờ, bạn có thể đóng góp bằng cách chia sẻ hoặc góp ý prompt mới."}
                </p>
              </div>
            )}
            {showQrBlock && donateNotice && (
              <p className="body-sm text-muted-foreground mt-6 pt-4 border-t border-border">{donateNotice}</p>
            )}
            {showQrBlock && bankReady && donateBank.transferNote && (
              <p className="body-sm text-muted-foreground mt-6 pt-4 border-t border-border">
                Nội dung chuyển khoản gợi ý: <span className="font-medium text-foreground">{donateBank.transferNote}</span>
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="heading-4 mb-4 flex items-center gap-2">
              <Github className="w-5 h-5 text-primary" />
              Đóng góp khác
            </h3>
            <ul className="space-y-3 body-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span>Chia sẻ trang web cho bạn bè, đồng nghiệp</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span>Góp ý prompt mới qua GitHub Issues</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span>Báo lỗi, đề xuất tính năng</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span>Viết bài giới thiệu trên blog hoặc Facebook của bạn</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span>Đóng góp mã nguồn (Next.js, Tailwind, TypeScript)</span>
              </li>
            </ul>
            {donateLinks.githubSponsors && (
              <a
                href={donateLinks.githubSponsors}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-md w-full justify-center mt-6"
              >
                <Github className="w-4 h-4" />
                GitHub Sponsors
              </a>
            )}
            <ContactInfo variant="default" className="mt-6 pt-6 border-t border-border" />
          </div>
        </div>
      </div>
    </section>
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
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel: string
  actionHref?: string
  onAction?: () => void
  copied?: boolean
  variant: "primary" | "secondary" | "accent" | "destructive" | "success"
}) {
  const variantStyles = {
    primary: {
      card: "bg-primary/5 border-primary/20",
      icon: "bg-primary/10 text-primary",
      button: "btn-primary",
    },
    secondary: {
      card: "bg-secondary border-border",
      icon: "bg-secondary text-secondary-foreground",
      button: "btn-secondary",
    },
    accent: {
      card: "bg-[rgb(var(--color-accent)/0.05)] border-[rgb(var(--color-accent)/0.2)]",
      icon: "bg-[rgb(var(--color-accent)/0.1)] text-accent",
      button: "bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-foreground))] hover:bg-[rgb(var(--color-accent-hover))]",
    },
    destructive: {
      card: "bg-[rgb(var(--color-destructive)/0.05)] border-[rgb(var(--color-destructive)/0.2)]",
      icon: "bg-[rgb(var(--color-destructive)/0.1)] text-[rgb(var(--color-destructive))]",
      button: "btn-destructive",
    },
    success: {
      card: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
      icon: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      button: "bg-green-600 hover:bg-green-700",
    },
  }

  const style = variantStyles[variant]

  return (
    <div className={cn("card text-center p-6", style.card)}>
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4", style.icon)}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="body-sm text-muted-foreground mb-4">{description}</p>
      {actionHref ? (
        <a
          href={actionHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("btn btn-md w-full justify-center", style.button)}
        >
          {actionLabel}
        </a>
      ) : onAction ? (
        <button
          onClick={onAction}
          className={cn("btn btn-md w-full justify-center", style.button)}
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