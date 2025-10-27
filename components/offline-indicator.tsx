"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!mounted || isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 backdrop-blur-sm">
      <WifiOff className="w-4 h-4 text-destructive" />
      <span className="text-sm font-medium text-destructive">You are offline - data saved locally</span>
    </div>
  )
}
