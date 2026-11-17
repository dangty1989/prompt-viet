"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CopyPromptButtonProps {
  content: string
}

export function CopyPromptButton({ content }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-muted text-foreground hover:bg-[rgb(var(--color-neutral-200))]"
      )}
      aria-label={copied ? "Đã sao chép" : "Sao chép prompt"}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Đã sao chép
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Sao chép
        </>
      )}
    </button>
  )
}