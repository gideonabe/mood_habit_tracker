"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Stats {
  totalEntries: number
  avgCompletion: number
  bestStreak: number
}

export function WeeklyStatsCard() {
  const [stats, setStats] = useState<Stats>({
    totalEntries: 0,
    avgCompletion: 0,
    bestStreak: 0,
  })

  useEffect(() => {
    const today = new Date()
    let totalEntries = 0
    let totalCompletion = 0
    let completionDays = 0
    let currentStreak = 0
    let bestStreak = 0

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const entry = localStorage.getItem(`entry-${dateStr}`)

      if (entry) {
        totalEntries++
        const parsed = JSON.parse(entry)
        const habits = parsed.habits || []
        const completed = habits.filter((h: any) => h.completed).length
        const total = habits.length

        if (total > 0) {
          const percentage = (completed / total) * 100
          totalCompletion += percentage
          completionDays++

          if (percentage === 100) {
            currentStreak++
            bestStreak = Math.max(bestStreak, currentStreak)
          } else {
            currentStreak = 0
          }
        }
      } else {
        currentStreak = 0
      }
    }

    setStats({
      totalEntries,
      avgCompletion: completionDays > 0 ? Math.round(totalCompletion / completionDays) : 0,
      bestStreak,
    })
  }, [])

  return (
    <>
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <p className="text-sm text-muted-foreground mb-2">Total Check-ins</p>
        <p className="text-3xl font-light text-foreground">{stats.totalEntries}</p>
        <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
      </Card>
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <p className="text-sm text-muted-foreground mb-2">Avg Completion</p>
        <p className="text-3xl font-light text-foreground">{stats.avgCompletion}%</p>
        <p className="text-xs text-muted-foreground mt-2">Habit completion rate</p>
      </Card>
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <p className="text-sm text-muted-foreground mb-2">Best Streak</p>
        <p className="text-3xl font-light text-foreground">{stats.bestStreak}</p>
        <p className="text-xs text-muted-foreground mt-2">Perfect days</p>
      </Card>
    </>
  )
}
