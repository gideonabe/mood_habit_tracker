"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodBackgroundProvider } from "@/components/mood-background-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { OfflineIndicator } from "@/components/offline-indicator"
import { usePinLock } from "@/components/pin-lock-provider"
import Link from "next/link"
import { ChevronLeft, Download, Upload, Lock, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { isPinSet, setPin, removePin } = usePinLock()
  const [mounted, setMounted] = useState(false)
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [pinSuccess, setPinSuccess] = useState("")
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetPin = () => {
    if (newPin.length < 4) {
      setPinError("PIN must be at least 4 digits")
      return
    }
    if (newPin !== confirmPin) {
      setPinError("PINs do not match")
      return
    }
    setPin(newPin)
    setPinSuccess("PIN set successfully")
    setNewPin("")
    setConfirmPin("")
    setPinError("")
    setTimeout(() => setPinSuccess(""), 3000)
  }

  const handleRemovePin = () => {
    if (confirm("Are you sure you want to remove the PIN lock?")) {
      removePin()
      setPinSuccess("PIN lock removed")
      setTimeout(() => setPinSuccess(""), 3000)
    }
  }

  const exportData = () => {
    const data: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && !key.startsWith("theme") && key !== "app-pin") {
        data[key] = localStorage.getItem(key)
      }
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mood-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        let importedCount = 0

        for (const [key, value] of Object.entries(data)) {
          if (typeof value === "string") {
            localStorage.setItem(key, value)
            importedCount++
          }
        }

        setPinSuccess(`Successfully imported ${importedCount} items. Please refresh the page.`)
        setTimeout(() => setPinSuccess(""), 5000)
      } catch (error) {
        setPinError("Failed to import data. Invalid file format.")
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL data? This includes all habits, notes, and mood entries. This cannot be undone.",
      )
    ) {
      const keysToDelete: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("entry-")) {
          keysToDelete.push(key)
        }
      }
      keysToDelete.forEach((key) => localStorage.removeItem(key))
      localStorage.removeItem("habits")
      setPinSuccess("All data cleared")
      setTimeout(() => setPinSuccess(""), 3000)
    }
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
              <h1 className="text-4xl font-light mb-2 text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your data and security</p>
            </div>

            {/* Success/Error Messages */}
            {pinSuccess && (
              <Card className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">{pinSuccess}</p>
              </Card>
            )}
            {pinError && (
              <Card className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">{pinError}</p>
              </Card>
            )}

            {/* PIN Lock Section */}
            <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">PIN Lock</h2>
              </div>

              {isPinSet ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">PIN lock is currently enabled</p>
                  <Button onClick={handleRemovePin} variant="outline" className="w-full bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove PIN Lock
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Set a PIN to lock your app and protect your data</p>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => {
                      setNewPin(e.target.value)
                      setPinError("")
                    }}
                    placeholder="Enter PIN (4+ digits)"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    maxLength={6}
                  />
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => {
                      setConfirmPin(e.target.value)
                      setPinError("")
                    }}
                    placeholder="Confirm PIN"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleSetPin}
                    className="w-full"
                    disabled={newPin.length < 4 || confirmPin.length < 4}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Set PIN Lock
                  </Button>
                </div>
              )}
            </Card>

            {/* Data Export/Import Section */}
            <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">Data Backup</h2>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Export your data as a JSON file for backup or transfer to another device
                </p>
                <Button onClick={exportData} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </Card>

            {/* Data Import Section */}
            <Card className="mb-8 p-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">Data Restore</h2>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Import previously exported data to restore your habits and notes
                </p>
                <input ref={setFileInput} type="file" accept=".json" onChange={importData} className="hidden" />
                <Button onClick={() => fileInput?.click()} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 backdrop-blur-sm bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50 shadow-lg">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4">Danger Zone</h2>
              <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                Permanently delete all your data. This action cannot be undone.
              </p>
              <Button
                onClick={clearAllData}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Data
              </Button>
            </Card>
          </div>
        </main>
        <OfflineIndicator />
      </div>
    </MoodBackgroundProvider>
  )
}
