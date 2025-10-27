"use client"

interface Habit {
  id: string
  name: string
  completed: boolean
  emoji: string
}

interface HabitListProps {
  habits: Habit[]
  onToggle: (habitId: string) => void
}

export function HabitList({ habits, onToggle }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No habits yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <button
          key={habit.id}
          onClick={() => onToggle(habit.id)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            habit.completed ? "bg-accent/10 opacity-60" : "bg-background/50 hover:bg-background/80"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              habit.completed ? "bg-accent border-accent" : "border-muted-foreground hover:border-accent"
            }`}
          >
            {habit.completed && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="text-xl">{habit.emoji}</span>
          <span
            className={`flex-1 text-left font-medium ${
              habit.completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {habit.name}
          </span>
        </button>
      ))}
    </div>
  )
}
