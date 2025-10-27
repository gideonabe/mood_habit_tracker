"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Mood = "peaceful" | "happy" | "energetic" | "calm" | "reflective" | "neutral"

interface MoodContextType {
  currentMood: Mood
  setMood: (mood: Mood) => void
  autoDetectMood: () => void
}

const MoodContext = createContext<MoodContextType | undefined>(undefined)

// Unsplash image URLs for each mood - high quality, soothing backgrounds
const moodImages: Record<Mood, string> = {
  // peaceful: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80", 
  peaceful: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&q=80", 

  happy: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80", // Sunny beach

  // energetic: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80",
  // energetic: "https://images.unsplash.com/photo-1566954593646-714f253211ca?w=1920&h=1080&fit=crop&q=80",
  energetic: "https://images.unsplash.com/photo-1523895665936-7bfe172b757d?w=1920&h=1080&fit=crop&q=80",

  calm: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80", // Forest path

  // reflective: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80", 
  // reflective: "https://images.unsplash.com/photo-1676057868280-d6b982d82859?w=1920&h=1080&fit=crop&q=80", 
  reflective: "https://images.unsplash.com/photo-1664270609204-22c03d22a065?w=1920&h=1080&fit=crop&q=80", 

  neutral: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80", // Neutral landscape
}

// Sentiment keywords for auto-mood detection
const sentimentKeywords = {
  happy: ["great", "amazing", "wonderful", "excellent", "love", "awesome", "fantastic", "brilliant", "perfect"],
  energetic: ["excited", "pumped", "motivated", "active", "running", "workout", "accomplished", "productive"],
  peaceful: ["calm", "relaxed", "peaceful", "serene", "quiet", "meditated", "rested", "comfortable"],
  calm: ["chill", "cool", "easy", "simple", "smooth", "flowing", "gentle", "soft"],
  reflective: ["thinking", "wondering", "considering", "learning", "realized", "understood", "thought"],
  neutral: [],
}

export function MoodBackgroundProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<Mood>("neutral")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved mood from localStorage
    const savedMood = localStorage.getItem("currentMood") as Mood | null
    if (savedMood) {
      setCurrentMood(savedMood)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("currentMood", currentMood)
    applyMoodBackground(currentMood)
  }, [currentMood, mounted])

  const applyMoodBackground = (mood: Mood) => {
    const imageUrl = moodImages[mood]
    document.documentElement.style.setProperty("--mood-bg-image", `url('${imageUrl}')`)
  }

  const autoDetectMood = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayEntry = localStorage.getItem(`entry-${today}`)

    if (!todayEntry) {
      setCurrentMood("neutral")
      return
    }

    const entry = JSON.parse(todayEntry)
    let detectedMood: Mood = "neutral"
    const moodScore: Record<Mood, number> = {
      peaceful: 0,
      happy: 0,
      energetic: 0,
      calm: 0,
      reflective: 0,
      neutral: 0,
    }

    // Analyze habits progress
    if (entry.habits && entry.habits.length > 0) {
      const completionRate = entry.habits.filter((h: any) => h.completed).length / entry.habits.length
      if (completionRate === 1) {
        moodScore.happy += 3
        moodScore.energetic += 2
      } else if (completionRate >= 0.75) {
        moodScore.happy += 2
        moodScore.energetic += 1
      } else if (completionRate >= 0.5) {
        moodScore.calm += 1
        moodScore.neutral += 1
      } else if (completionRate < 0.25) {
        moodScore.reflective += 1
      }
    }

    // Analyze daily notes sentiment
    if (entry.notes && entry.notes.length > 0) {
      const notesText = entry.notes.map((n: any) => n.content.toLowerCase()).join(" ")

      Object.entries(sentimentKeywords).forEach(([mood, keywords]) => {
        keywords.forEach((keyword) => {
          if (notesText.includes(keyword)) {
            moodScore[mood as Mood] += 2
          }
        })
      })
    }

    // Find the mood with highest score
    detectedMood = (Object.entries(moodScore).sort(([, a], [, b]) => b - a)[0][0] as Mood) || "neutral"

    setCurrentMood(detectedMood)
  }

  return (
    <MoodContext.Provider value={{ currentMood, setMood: setCurrentMood, autoDetectMood }}>
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `var(--mood-bg-image, url('${moodImages.neutral}'))`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error("useMood must be used within MoodBackgroundProvider")
  }
  return context
}
