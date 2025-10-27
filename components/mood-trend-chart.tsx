"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MoodData {
  date: string
  mood: number
}

const moodValues: Record<string, number> = {
  peaceful: 5,
  happy: 4,
  energetic: 4,
  calm: 5,
  reflective: 3,
  neutral: 2,
}

export function MoodTrendChart() {
  const [data, setData] = useState<MoodData[]>([])

  useEffect(() => {
    const today = new Date()
    const chartData: MoodData[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const entry = localStorage.getItem(`entry-${dateStr}`)

      if (entry) {
        const parsed = JSON.parse(entry)
        chartData.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mood: moodValues[parsed.mood] || 0,
        })
      } else {
        chartData.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mood: 0,
        })
      }
    }

    setData(chartData)
  }, [])

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Mood Trend (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" domain={[0, 5]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ fill: "var(--accent)", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
