"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HabitData {
  date: string
  completion: number
}

export function HabitCompletionChart() {
  const [data, setData] = useState<HabitData[]>([])

  useEffect(() => {
    const today = new Date()
    const chartData: HabitData[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const entry = localStorage.getItem(`entry-${dateStr}`)

      if (entry) {
        const parsed = JSON.parse(entry)
        const habits = parsed.habits || []
        const completed = habits.filter((h: any) => h.completed).length
        const total = habits.length
        const percentage = total > 0 ? (completed / total) * 100 : 0

        chartData.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          completion: Math.round(percentage),
        })
      } else {
        chartData.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          completion: 0,
        })
      }
    }

    setData(chartData)
  }, [])

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Habit Completion (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
            formatter={(value) => `${value}%`}
          />
          <Bar dataKey="completion" fill="var(--accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
