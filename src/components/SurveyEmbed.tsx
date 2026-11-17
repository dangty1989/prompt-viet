"use client"

import { MessageSquare, Star, HelpCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SurveyEmbedProps {
  promptId: string
  promptTitle: string
  googleFormUrl?: string
}

export function SurveyEmbed({ promptId, promptTitle, googleFormUrl }: SurveyEmbedProps) {
  const [showSurvey, setShowSurvey] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const configuredUrl = (googleFormUrl || process.env.NEXT_PUBLIC_SURVEY_FORM_URL || "").trim()
  const isValidForm = /^https:\/\/forms\.(gle|google\.com)\//.test(configuredUrl)

  // Chưa cấu hình Google Form thật thì không render khảo sát (tránh iframe trắng/lỗi).
  if (!isValidForm) return null

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Cảm ơn bạn đã phản hồi!</h3>
        <p className="text-green-700 dark:text-green-300 text-sm">Đóng góp của bạn giúp dự án tốt hơn mỗi ngày.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-green-600 dark:text-green-400 hover:underline"
        >
          Gửi thêm ý kiến khác
        </button>
      </div>
    )
  }

  if (!showSurvey) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Đánh giá prompt này</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              Bạn có 2 phút? Hãy cho chúng tôi biết prompt này có hữu ích không. Phản hồi giúp chúng tôi cải thiện chất lượng.
            </p>
            <button
              onClick={() => setShowSurvey(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Khảo sát nhanh</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Prompt: {promptTitle}</p>
          </div>
        </div>
        <button
          onClick={() => setShowSurvey(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Đóng khảo sát"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <iframe
        src={configuredUrl}
        title="Khảo sát prompt"
        className="w-full min-h-[500px] border-0 rounded-lg"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setSubmitted(true)
            setShowSurvey(false)
          }}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Đã hoàn thành khảo sát
        </button>
      </div>
    </div>
  )
}