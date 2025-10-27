"use client"

import type React from "react"
import { PinLockProvider } from "@/components/pin-lock-provider"
import { PinLockGuard } from "@/components/pin-lock-guard"

function PinLockWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PinLockProvider>
      <PinLockGuard>{children}</PinLockGuard>
    </PinLockProvider>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <PinLockWrapper>{children}</PinLockWrapper>
}
