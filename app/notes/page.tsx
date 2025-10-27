"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodBackgroundProvider } from "@/components/mood-background-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { OfflineIndicator } from "@/components/offline-indicator"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"

interface DailyNote {
  id: string
  content: string
  timestamp: number
}

interface DailyEntry {
  date: string
  mood: string
  notes: DailyNote[]
}

export default function NotesPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadAllEntries()
  }, [])

  const loadAllEntries = () => {
    const allEntries: DailyEntry[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("entry-")) {
        const entry = JSON.parse(localStorage.getItem(key) || "{}")
        allEntries.push(entry)
      }
    }
    // Sort by date descending
    allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setEntries(allEntries)
  }

  const selectedEntry = entries.find((e) => e.date === selectedDate)

  const changeDate = (days: number) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    setSelectedDate(current.toISOString().split("T")[0])
  }

  const deleteNote = (noteId: string) => {
    if (!selectedEntry) return
    const updatedNotes = selectedEntry.notes.filter((n) => n.id !== noteId)
    const updatedEntry = { ...selectedEntry, notes: updatedNotes }
    localStorage.setItem(`entry-${selectedDate}`, JSON.stringify(updatedEntry))
    loadAllEntries()
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  if (!mounted) return null

  return (
    <MoodBackgroundProvider>
      <div className="min-h-screen transition-colors duration-1000">
        <header className="fixed top-0 right-0 p-4 z-50">
          <ThemeToggle />
        </header>
        <main className="pt-20 pb-8">
          <div className="max-w-2xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <Link href="/">
                <Button variant="outline" size="sm" className="mb-4 bg-transparent">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Today
                </Button>
              </Link>
              <h1 className="text-4xl font-light mb-2 text-foreground">Notes History</h1>
              <p className="text-muted-foreground">Browse and manage your daily notes</p>
            </div>

            {/* Date Navigation */}
            <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 hover:bg-background/30 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Selected Date</p>
                  <p className="text-xl font-semibold text-foreground">{formatDate(selectedDate)}</p>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 hover:bg-background/30 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </Card>

            {/* Notes Display */}
            {selectedEntry && selectedEntry.notes && selectedEntry.notes.length > 0 ? (
              <div className="space-y-4">
                {selectedEntry.notes.map((note) => (
                  <Card
                    key={note.id}
                    className="p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
                        <p className="text-sm text-muted-foreground mt-3">{formatTime(note.timestamp)}</p>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                        title="Delete note"
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
                <p className="text-muted-foreground">No notes for this date</p>
              </Card>
            )}

            {/* All Dates List */}
            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-4 text-foreground">All Dates with Notes</h2>
              <div className="space-y-2">
                {entries
                  .filter((e) => e.notes && e.notes.length > 0)
                  .map((entry) => (
                    <button
                      key={entry.date}
                      onClick={() => setSelectedDate(entry.date)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedDate === entry.date
                          ? "bg-accent/20 border border-accent"
                          : "hover:bg-background/30 border border-border/50"
                      }`}
                    >
                      <p className="font-medium text-foreground">{formatDate(entry.date)}</p>
                      <p className="text-sm text-muted-foreground">{entry.notes.length} note(s)</p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </main>
        <OfflineIndicator />
      </div>
    </MoodBackgroundProvider>
  )
}
