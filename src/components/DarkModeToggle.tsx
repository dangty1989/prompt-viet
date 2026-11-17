"use client"

import { Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false
  const savedTheme = localStorage.getItem("theme")
  return savedTheme === "dark"
}

function setThemeOnDocument(isDark: boolean) {
  if (typeof window === "undefined") return
  document.documentElement.classList.toggle("dark", isDark)
  const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement
  if (meta) meta.content = isDark ? "dark" : "light"
}

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme)

  // Apply theme on mount and sync meta color-scheme
  useEffect(() => {
    setThemeOnDocument(isDark)
  }, [isDark])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    localStorage.setItem("color-scheme", newIsDark ? "dark" : "light")
    // setThemeOnDocument will be called via the useEffect above
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-icon btn-ghost shrink-0"
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}