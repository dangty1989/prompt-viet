import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { siteUrl } from "@/config/site"

const googleVerification = (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "").trim()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Serif for headings — the ivory/gold palette needs a print voice, not a third geometric sans.
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prompt Việt: thư viện prompt tiếng Việt cho ChatGPT, Gemini",
    template: "%s | Prompt Việt",
  },
  description: "Hơn 300 prompt tiếng Việt cho ChatGPT, Gemini và Google Workspace. Tìm theo danh mục hoặc từ khoá, bấm một lần là sao chép được.",
  keywords: ["prompt", "ChatGPT", "Gemini", "Google Workspace", "AI", "tiếng Việt", "prompt engineering", "AI Vietnam"],
  authors: [{ name: "Prompt Việt Community" }],
  creator: "Prompt Việt",
  publisher: "Prompt Việt",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Prompt Việt",
    title: "Prompt Việt: thư viện prompt tiếng Việt",
    description: "Prompt tiếng Việt cho ChatGPT, Gemini và Google Workspace, tìm theo danh mục rồi sao chép một lần bấm.",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Prompt Việt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Việt",
    description: "Prompt tiếng Việt cho ChatGPT, Gemini và Google Workspace",
    images: ["/images/og-image.svg"],
  },
  // Chỉ khai báo verification khi đã set mã thật; mã giả trong HTML gây lỗi
  // Search Console chứ không giúp verify.
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "rgb(var(--color-background))" },
    { media: "(prefers-color-scheme: dark)", color: "rgb(var(--color-neutral-950))" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.querySelector('meta[name="color-scheme"]').content=localStorage.getItem("color-scheme")??"light dark"}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}