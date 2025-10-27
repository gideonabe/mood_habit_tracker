"use client"

import { useEffect, useState } from "react"
import { TodayDashboard } from "@/components/today-dashboard"
import { MoodBackgroundProvider } from "@/components/mood-background-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { OfflineIndicator } from "@/components/offline-indicator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, Settings } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <MoodBackgroundProvider>
      <div className="min-h-screen transition-colors duration-1000">
        <header className="fixed top-0 right-0 p-4 z-50 flex gap-2">
          <Link href="/settings">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg hover:bg-white/70 dark:hover:bg-slate-900/70"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/notes">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg hover:bg-white/70 dark:hover:bg-slate-900/70"
              title="Notes History"
            >
              <BookOpen className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/insights">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg hover:bg-white/70 dark:hover:bg-slate-900/70"
              title="Insights"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </Link>
          <ThemeToggle />
        </header>
        <main className="pt-20">
          <TodayDashboard />
        </main>
        <OfflineIndicator />
      </div>
    </MoodBackgroundProvider>
  )
}
