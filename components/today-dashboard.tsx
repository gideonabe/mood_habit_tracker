"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HabitList } from "./habit-list"
import { MoodSelector } from "./mood-selector"
import { useMood } from "./mood-background-provider"
import { Trash2, Plus, X } from "lucide-react"

interface Habit {
  id: string
  name: string
  completed: boolean
  emoji: string
}

interface DailyNote {
  id: string
  content: string
  timestamp: number
}

interface DailyEntry {
  date: string
  mood: string
  habits: Habit[]
  notes: DailyNote[]
}

export function TodayDashboard() {
  const { currentMood, autoDetectMood } = useMood()
  const [habits, setHabits] = useState<Habit[]>([])
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null)
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitEmoji, setNewHabitEmoji] = useState("✨")
  const [newNote, setNewNote] = useState("")

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    loadTodayData()
  }, [])

  const loadTodayData = () => {
    const stored = localStorage.getItem(`entry-${today}`)
    if (stored) {
      const entry = JSON.parse(stored)
      setTodayEntry(entry)
      setHabits(entry.habits)
    } else {
      // Load habits from general storage
      const allHabits = localStorage.getItem("habits")
      if (allHabits) {
        const parsedHabits = JSON.parse(allHabits)
        const todayHabits = parsedHabits.map((h: Habit) => ({
          ...h,
          completed: false,
        }))
        setHabits(todayHabits)
      }
      // Initialize with empty notes array
      setTodayEntry({
        date: today,
        mood: "",
        habits: [],
        notes: [],
      })
    }
  }

  useEffect(() => {
    autoDetectMood()
  }, [habits, todayEntry?.notes])

  const saveTodayData = (updatedHabits: Habit[], mood?: string, notes?: DailyNote[]) => {
    const entry: DailyEntry = {
      date: today,
      mood: mood || todayEntry?.mood || "",
      habits: updatedHabits,
      notes: notes || todayEntry?.notes || [],
    }
    localStorage.setItem(`entry-${today}`, JSON.stringify(entry))
    setTodayEntry(entry)
  }

  const toggleHabit = (habitId: string) => {
    const updated = habits.map((h) => (h.id === habitId ? { ...h, completed: !h.completed } : h))
    setHabits(updated)
    saveTodayData(updated)
  }

  const addHabit = () => {
    if (!newHabitName.trim()) return
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completed: false,
      emoji: newHabitEmoji,
    }
    const updated = [...habits, newHabit]
    setHabits(updated)
    saveTodayData(updated)
    setNewHabitName("")
    setNewHabitEmoji("✨")

    // Save to general habits list
    const allHabits = localStorage.getItem("habits")
    const habitsList = allHabits ? JSON.parse(allHabits) : []
    habitsList.push(newHabit)
    localStorage.setItem("habits", JSON.stringify(habitsList))
  }

  const deleteHabit = (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId)
    setHabits(updated)
    saveTodayData(updated)

    // Remove from general habits list
    const allHabits = localStorage.getItem("habits")
    if (allHabits) {
      const habitsList = JSON.parse(allHabits).filter((h: Habit) => h.id !== habitId)
      localStorage.setItem("habits", JSON.stringify(habitsList))
    }
  }

  const addNote = () => {
    if (!newNote.trim()) return
    const note: DailyNote = {
      id: Date.now().toString(),
      content: newNote,
      timestamp: Date.now(),
    }
    const updatedNotes = [...(todayEntry?.notes || []), note]
    saveTodayData(habits, undefined, updatedNotes)
    setNewNote("")
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = (todayEntry?.notes || []).filter((n) => n.id !== noteId)
    saveTodayData(habits, undefined, updatedNotes)
  }

  const completedCount = habits.filter((h) => h.completed).length
  const completionPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0

  const moodLabels: Record<string, string> = {
    peaceful: "Peaceful",
    happy: "Happy",
    energetic: "Energetic",
    calm: "Calm",
    reflective: "Reflective",
    neutral: "Neutral",
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-0 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-2 text-foreground">Today</h1>
        <p className="text-muted-foreground">
          {/* {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })} */}
          {new Date().toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>

      {/* Mood Selector */}
      <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-foreground">How are you feeling?</h2>
        <MoodSelector />
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Current mood:</p>
          <p className="text-lg font-medium text-foreground capitalize">{moodLabels[currentMood]}</p>
        </div>
      </Card>

      {/* Progress Ring */}
      <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Today's Progress</p>
            <p className="text-3xl font-light text-foreground">
              {completedCount}/{habits.length}
            </p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(completionPercentage / 100) * 282.7} 282.7`}
                className="text-accent transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">{Math.round(completionPercentage)}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Habits */}
      <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Daily Habits</h2>
        <HabitList habits={habits} onToggle={toggleHabit} />

        {habits.length > 0 && (
          <div className="mt-4 space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-background/30">
                <span className="text-sm text-muted-foreground">
                  {habit.emoji} {habit.name}
                </span>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  title="Delete habit"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Habit Form */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addHabit()}
              placeholder="Add a new habit..."
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <select
              value={newHabitEmoji}
              onChange={(e) => setNewHabitEmoji(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="✨">✨</option>
              <option value="🎯">🎯</option>
              <option value="💪">💪</option>
              <option value="🧘">🧘</option>
              <option value="📚">📚</option>
              <option value="🏃">🏃</option>
              <option value="🍎">🍎</option>
              <option value="💧">💧</option>
            </select>
          </div>
          <Button onClick={addHabit} className="w-full" disabled={!newHabitName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </Card>

      {/* Daily Notes */}
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Daily Notes</h2>

        {todayEntry?.notes && todayEntry.notes.length > 0 && (
          <div className="mb-6 space-y-3 max-h-64 overflow-y-auto">
            {todayEntry.notes.map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(note.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors shrink-0"
                    title="Delete note"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                addNote()
              }
            }}
            placeholder="Write a note... (Ctrl+Enter to add)"
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{newNote.length} characters</p>
            <Button onClick={addNote} disabled={!newNote.trim()} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
