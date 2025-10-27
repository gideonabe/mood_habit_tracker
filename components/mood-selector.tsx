// "use client"

// import { useMood, type Mood } from "./mood-background-provider"

// const moods: Array<{ value: Mood; label: string; emoji: string }> = [
//   { value: "peaceful", label: "Peaceful", emoji: "🕊️" },
//   { value: "happy", label: "Happy", emoji: "😊" },
//   { value: "energetic", label: "Energetic", emoji: "⚡" },
//   { value: "calm", label: "Calm", emoji: "🌿" },
//   { value: "reflective", label: "Reflective", emoji: "🤔" },
//   { value: "neutral", label: "Neutral", emoji: "😐" },
// ]

// export function MoodSelector() {
//   const { currentMood, setMood } = useMood()

//   return (
//     <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
//       {moods.map((mood) => (
//         <button
//           key={mood.value}
//           onClick={() => setMood(mood.value)}
//           className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
//             currentMood === mood.value
//               ? "bg-accent/20 ring-2 ring-accent scale-105"
//               : "bg-background/50 hover:bg-background/80"
//           }`}
//         >
//           <span className="text-2xl mb-1">{mood.emoji}</span>
//           <span className="text-xs font-medium text-foreground text-center">{mood.label}</span>
//         </button>
//       ))}
//     </div>
//   )
// }





"use client"

import { useMood, type Mood } from "./mood-background-provider"
import { Sparkles } from "lucide-react"

const moods: Array<{ value: Mood; label: string; emoji: string }> = [
  { value: "peaceful", label: "Peaceful", emoji: "🕊️" },
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
  { value: "calm", label: "Calm", emoji: "🌿" },
  { value: "reflective", label: "Reflective", emoji: "🤔" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
]

export function MoodSelector() {
  const { currentMood, setMood, autoDetectMood } = useMood()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setMood(mood.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
              currentMood === mood.value
                ? "bg-accent/20 ring-2 ring-accent scale-105"
                : "bg-background/50 hover:bg-background/80"
            }`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium text-foreground text-center">{mood.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={autoDetectMood}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors text-sm font-medium"
      >
        <Sparkles className="w-4 h-4" />
        Auto-detect Mood
      </button>
    </div>
  )
}
