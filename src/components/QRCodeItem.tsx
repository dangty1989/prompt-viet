"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface QRCodeItemProps {
  title: string
  /** Đường dẫn ảnh QR. Chuỗi rỗng = chưa cấu hình, sẽ KHÔNG render <img>. */
  qrSrc?: string
  info: string[]
  className?: string
}

export function QRCodeItem({ title, qrSrc = "", info, className }: QRCodeItemProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(qrSrc) && !failed

  return (
    <div className={cn("text-center", className)}>
      <p className="font-medium text-foreground mb-2">{title}</p>
      <div className="w-40 h-40 mx-auto mb-3 bg-muted rounded-lg flex items-center justify-center border border-border overflow-hidden">
        {showImage ? (
          <img
            src={qrSrc}
            alt={`${title} QR Code`}
            className="w-full h-full object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="text-muted-foreground text-xs px-4">Chưa có mã QR</span>
        )}
      </div>
      {info.length > 0 && (
        <ul className="body-sm text-muted-foreground space-y-1">
          {info.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}