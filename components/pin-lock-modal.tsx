"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface PinLockModalProps {
  onUnlock: (pin: string) => boolean
}

export function PinLockModal({ onUnlock }: PinLockModalProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (onUnlock(pin)) {
      setPin("")
      setError("")
    } else {
      setError("Incorrect PIN")
      setPin("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-sm mx-4 p-8 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 border-0 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-accent/10">
            <Lock className="w-6 h-6 text-accent" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2 text-foreground">App Locked</h2>
        <p className="text-center text-muted-foreground mb-6">Enter your PIN to unlock</p>

        <div className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.slice(0, 6))
              setError("")
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter PIN"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-center text-2xl tracking-widest"
            maxLength={6}
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button onClick={handleSubmit} className="w-full" disabled={pin.length < 4}>
            Unlock
          </Button>
        </div>
      </Card>
    </div>
  )
}
