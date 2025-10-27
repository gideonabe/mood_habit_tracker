"use client"

import type React from "react"

import { usePinLock } from "./pin-lock-provider"
import { PinLockModal } from "./pin-lock-modal"

export function PinLockGuard({ children }: { children: React.ReactNode }) {
  const { isLocked, unlock } = usePinLock()

  if (isLocked) {
    return <PinLockModal onUnlock={unlock} />
  }

  return children
}
