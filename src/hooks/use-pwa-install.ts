import { useEffect, useState, useCallback } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface UsePWAInstallReturn {
  isInstallPromptVisible: boolean
  isInstalled: boolean
  showInstallPrompt: () => void
  hideInstallPrompt: () => void
  handleInstall: () => Promise<void>
  handleCancel: () => void
}

export const usePWAInstall = (): UsePWAInstallReturn => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null)

  // Check if app is already installed
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }
  }, [])

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()

      // Check if user dismissed it recently (24 hours)
      const now = Date.now()
      if (dismissedUntil && now < dismissedUntil) {
        console.log("[PWA] Install prompt dismissed until:", new Date(dismissedUntil))
        return
      }

      setInstallEvent(e as BeforeInstallPromptEvent)
      setIsInstallPromptVisible(true)
      console.log("[PWA] Install prompt ready")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [dismissedUntil])

  const showInstallPrompt = useCallback(() => {
    setIsInstallPromptVisible(true)
  }, [])

  const hideInstallPrompt = useCallback(() => {
    setIsInstallPromptVisible(false)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!installEvent) return

    try {
      await installEvent.prompt()
      const { outcome } = await installEvent.userChoice

      if (outcome === "accepted") {
        console.log("[PWA] Installation accepted by user")
        setIsInstallPromptVisible(false)
        setInstallEvent(null)
        setIsInstalled(true)
      } else {
        console.log("[PWA] Installation dismissed by user")
      }
    } catch (error) {
      console.error("[PWA] Installation error:", error)
    }
  }, [installEvent])

  const handleCancel = useCallback(() => {
    // Dismiss for 24 hours
    const dismissUntil = Date.now() + 24 * 60 * 60 * 1000
    setDismissedUntil(dismissUntil)
    localStorage.setItem("pwaInstallDismissedUntil", dismissUntil.toString())
    setIsInstallPromptVisible(false)
    console.log("[PWA] Installation prompt dismissed for 24 hours")
  }, [])

  // Load dismissal time from localStorage on mount
  useEffect(() => {
    const storedDismissalTime = localStorage.getItem("pwaInstallDismissedUntil")
    if (storedDismissalTime) {
      const dismissUntil = Number.parseInt(storedDismissalTime)
      if (dismissUntil > Date.now()) {
        setDismissedUntil(dismissUntil)
      }
    }
  }, [])

  return {
    isInstallPromptVisible,
    isInstalled,
    showInstallPrompt,
    hideInstallPrompt,
    handleInstall,
    handleCancel,
  }
}