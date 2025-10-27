"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface PinLockContextType {
  isLocked: boolean
  isPinSet: boolean
  setPin: (pin: string) => void
  unlock: (pin: string) => boolean
  lock: () => void
  removePin: () => void
}

const PinLockContext = createContext<PinLockContextType | undefined>(undefined)

export function PinLockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false)
  const [isPinSet, setIsPinSet] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedPin = localStorage.getItem("app-pin")
    setIsPinSet(!!storedPin)
    setIsLocked(!!storedPin)
  }, [])

  const setPin = (pin: string) => {
    if (pin.length < 4) return
    localStorage.setItem("app-pin", pin)
    setIsPinSet(true)
    setIsLocked(true)
  }

  const unlock = (pin: string): boolean => {
    const storedPin = localStorage.getItem("app-pin")
    if (storedPin === pin) {
      setIsLocked(false)
      return true
    }
    return false
  }

  const lock = () => {
    if (isPinSet) {
      setIsLocked(true)
    }
  }

  const removePin = () => {
    localStorage.removeItem("app-pin")
    setIsPinSet(false)
    setIsLocked(false)
  }

  if (!mounted) return null

  return (
    <PinLockContext.Provider value={{ isLocked, isPinSet, setPin, unlock, lock, removePin }}>
      {children}
    </PinLockContext.Provider>
  )
}

export function usePinLock() {
  const context = useContext(PinLockContext)
  if (!context) {
    throw new Error("usePinLock must be used within PinLockProvider")
  }
  return context
}
