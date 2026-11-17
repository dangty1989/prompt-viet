import { Mail, Globe, ExternalLink } from "lucide-react"
import { Github, Facebook } from "@/components/CustomIcons"
import { cn } from "@/lib/utils"
import contact from "@/data/contact.json"

interface ContactInfoProps {
  variant?: "default" | "compact" | "footer"
  className?: string
}

export function ContactInfo({ variant = "default", className }: ContactInfoProps) {
  // Ẩn link còn là placeholder (your-profile, you@example.com...) để không dẫn người dùng đi sai.
  const isPlaceholder = (href: string) =>
    !href || /your[-_]|example\.(com|org|net)|placeholder/i.test(href)

  const links = [
    { icon: Facebook, href: contact.facebook, label: "Facebook" },
    { icon: Mail, href: `mailto:${contact.email}`, label: "Email" },
    { icon: Globe, href: contact.blog, label: "Blog" },
    { icon: Github, href: contact.github, label: "GitHub" },
  ].filter((link) => !isPlaceholder(link.href))

  if (links.length === 0) return null

  const variants = {
    default: "flex flex-wrap items-center gap-3",
    compact: "flex flex-wrap items-center gap-2",
    footer: "flex flex-col items-start gap-2",
  }

  const iconSizes = {
    default: "w-5 h-5",
    compact: "w-4 h-4",
    footer: "w-5 h-5",
  }

  return (
    <div className={cn(variants[variant], className)}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={cn(
              "flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors",
              variant === "footer" && "w-full",
              variant === "compact" && "text-sm"
            )}
            aria-label={link.label}
          >
            <Icon className={cn(iconSizes[variant], "flex-shrink-0")} />
            <span className={variant === "footer" ? "font-medium text-sm" : "hidden sm:inline text-sm"}>
              {link.label}
            </span>
            {link.href.startsWith("http") && variant !== "compact" && (
              <ExternalLink className="w-3 h-3 opacity-50" />
            )}
          </a>
        )
      })}
    </div>
  )
}