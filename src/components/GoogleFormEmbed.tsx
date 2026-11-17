"use client"

import { MessageSquare, Star, HelpCircle, ExternalLink } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface GoogleFormEmbedProps {
  formUrl?: string
  title?: string
  description?: string
}

export function GoogleFormEmbed({ 
  formUrl, 
  title = "Khảo sát chất lượng Prompt Việt",
  description = "Góp ý 2 phút giúp thư viện prompt tiếng Việt tốt hơn. Cảm ơn bạn!"
}: GoogleFormEmbedProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const configuredUrl = (formUrl || process.env.NEXT_PUBLIC_SURVEY_FORM_URL || "").trim()
  const isValidForm = /^https:\/\/(forms\.(gle|google\.com)\/)/.test(configuredUrl)

  if (!isValidForm) return null

  if (submitted) {
    return (
      <div className={cn("bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center", "transition-all duration-300")}>
        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-7 h-7 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Cảm ơn bạn đã góp ý!</h3>
        <p className="text-green-700 dark:text-green-300 text-sm mb-6 max-w-md mx-auto">
          Đóng góp của bạn giúp Prompt Việt tốt hơn mỗi ngày. Mọi phản hồi đều được đọc kỹ.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
        >
          Gửi thêm ý kiến khác
        </button>
      </div>
    )
  }

  if (!showForm) {
    return (
      <div className={cn("bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8", "transition-all duration-300")}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm mb-6">{description}</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Star className="w-4 h-4" />
              Bắt đầu khảo sát (2 phút)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Google Forms - mở trong iframe</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          aria-label="Đóng khảo sát"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative">
        <iframe
          src={configuredUrl}
          title="Khảo sát Prompt Việt"
          className="w-full min-h-[600px] border-0"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
        />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
        <button
          onClick={() => {
            setSubmitted(true)
            setShowForm(false)
          }}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          Đã hoàn thành khảo sát
        </button>
        <a
          href={configuredUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Mở trong tab mới
        </a>
      </div>
    </div>
  )
}