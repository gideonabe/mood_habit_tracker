"use client"

import * as React from "react"

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsDark(customEvent.detail.isDark)
    }

    window.addEventListener("themechange", handleThemeChange)
    return () => window.removeEventListener("themechange", handleThemeChange)
  }, [])

  const toggleTheme = React.useCallback(() => {
    const html = document.documentElement
    const newIsDark = !isDark

    if (newIsDark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    window.dispatchEvent(new CustomEvent("themechange", { detail: { isDark: newIsDark } }))
  }, [isDark])

  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
