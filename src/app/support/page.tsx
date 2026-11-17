import { Metadata } from "next"
import SupportPageClient from "./SupportPageClient"

export const metadata: Metadata = {
  title: "Ủng hộ dự án",
  description: "Ủng hộ Prompt Việt để trả tiền tên miền, hosting và công viết prompt mới. Chuyển khoản, MoMo hoặc Ko-fi.",
}

export default function SupportPage() {
  // Khối QR nằm trong SupportPageClient; không render SupportQRServer để tránh trùng 2 khối QR.
  return <SupportPageClient />
}