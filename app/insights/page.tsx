"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodBackgroundProvider } from "@/components/mood-background-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { OfflineIndicator } from "@/components/offline-indicator"
import { MoodTrendChart } from "@/components/mood-trend-chart"
import { HabitCompletionChart } from "@/components/habit-completion-chart"
import { WeeklyStatsCard } from "@/components/weekly-stats-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <MoodBackgroundProvider>
      <div className="min-h-screen transition-colors duration-1000">
        <header className="fixed top-0 right-0 p-4 z-50 flex gap-2">
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg hover:bg-white/70 dark:hover:bg-slate-900/70"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <ThemeToggle />
        </header>

        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 pt-0 pb-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-light mb-2 text-foreground">Insights</h1>
              <p className="text-muted-foreground">Track your mood patterns and habit progress</p>
            </div>

            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <WeeklyStatsCard />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <MoodTrendChart />
              <HabitCompletionChart />
            </div>

            {/* Mood Distribution */}
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Mood Distribution (Last 7 Days)</h2>
              <MoodDistributionChart />
            </Card>
          </div>
        </main>
        <OfflineIndicator />
      </div>
    </MoodBackgroundProvider>
  )
}

function MoodDistributionChart() {
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({
    peaceful: 0,
    happy: 0,
    energetic: 0,
    calm: 0,
    reflective: 0,
    neutral: 0,
  })

  useEffect(() => {
    const today = new Date()
    const counts = { peaceful: 0, happy: 0, energetic: 0, calm: 0, reflective: 0, neutral: 0 }

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const entry = localStorage.getItem(`entry-${dateStr}`)
      if (entry) {
        const parsed = JSON.parse(entry)
        if (parsed.mood && parsed.mood in counts) {
          counts[parsed.mood as keyof typeof counts]++
        }
      }
    }

    setMoodCounts(counts)
  }, [])

  const moodColors: Record<string, string> = {
    peaceful: "bg-purple-500",
    happy: "bg-yellow-500",
    energetic: "bg-orange-500",
    calm: "bg-green-500",
    reflective: "bg-blue-500",
    neutral: "bg-gray-500",
  }

  const moodLabels: Record<string, string> = {
    peaceful: "Peaceful",
    happy: "Happy",
    energetic: "Energetic",
    calm: "Calm",
    reflective: "Reflective",
    neutral: "Neutral",
  }

  const total = Object.values(moodCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      {Object.entries(moodCounts).map(([mood, count]) => (
        <div key={mood}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground capitalize">{moodLabels[mood]}</span>
            <span className="text-sm text-muted-foreground">{count} days</span>
          </div>
          <div className="w-full bg-background/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${moodColors[mood]}`}
              style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
