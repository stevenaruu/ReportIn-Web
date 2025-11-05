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

const isSubdomainOnly = (): boolean => {
  const hostname = window.location.hostname

  if (hostname === "localhost") return true;

  const rootDomain = "reportin.my.id"
  // Only show prompt if it's a subdomain (e.g., contoh.reportin.my.id)
  // Don't show on root domain (reportin.my.id) or www.reportin.my.id
  const isRoot = hostname === rootDomain || hostname === `www.${rootDomain}`
  return !isRoot
}

export const usePWAInstall = (): UsePWAInstallReturn => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null)

  const handleCancel = useCallback(() => {
    // Dismiss for 24 hours
    const dismissUntil = Date.now() + 24 * 60 * 60 * 1000
    setDismissedUntil(dismissUntil)
    localStorage.setItem("pwaInstallDismissedUntil", dismissUntil.toString())
    setIsInstallPromptVisible(false)
    console.log("[PWA] Installation prompt dismissed for 24 hours")
  }, [])

  // Check if app is already installed
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }
  }, [])

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("[PWA] beforeinstallprompt event triggered")

      if (!isSubdomainOnly()) {
        console.log("[PWA] Root domain detected - PWA prompt disabled on root domain")
        return
      }

      e.preventDefault()

      const now = Date.now()
      if (dismissedUntil && now < dismissedUntil) {
        console.log("[PWA] Install prompt dismissed until:", new Date(dismissedUntil))
        return
      }

      const beforeInstallEvent = e as BeforeInstallPromptEvent
      if (!beforeInstallEvent.prompt) {
        console.warn("[PWA] beforeinstallprompt event missing prompt method")
        return
      }

      setInstallEvent(beforeInstallEvent)
      setIsInstallPromptVisible(true)
      console.log("[PWA] Install prompt ready and visible")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    const handleAppInstalled = () => {
      console.log("[PWA] App successfully installed")
      setIsInstalled(true)
      setIsInstallPromptVisible(false)
      setInstallEvent(null)
    }

    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [dismissedUntil])

  const showInstallPrompt = useCallback(() => {
    setIsInstallPromptVisible(true)
  }, [])

  const hideInstallPrompt = useCallback(() => {
    setIsInstallPromptVisible(false)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!installEvent) {
      console.log("[PWA] No install event available - this browser may not support PWA installation")
      return
    }

    if (!installEvent.prompt || typeof installEvent.prompt !== "function") {
      console.error("[PWA] prompt() method not available - trying alternative installation methods")
      alert(
        "To install this app:\n\n1. Tap the menu button (⋮) in your browser\n2. Select 'Install app' or 'Add to Home Screen'\n\nOr look for an install banner at the top of your screen.",
      )
      return
    }

    try {
      console.log("[PWA] Showing install prompt")
      await installEvent.prompt()

      if (installEvent.userChoice && typeof installEvent.userChoice.then === "function") {
        const choiceResult = await Promise.race([
          installEvent.userChoice,
          new Promise((_, reject) => setTimeout(() => reject(new Error("userChoice timeout")), 5000)),
        ])

        const { outcome } = choiceResult as { outcome: "accepted" | "dismissed" }

        if (outcome === "accepted") {
          console.log("[PWA] Installation accepted by user")
          setIsInstallPromptVisible(false)
          setInstallEvent(null)
          setIsInstalled(true)
        } else {
          console.log("[PWA] Installation dismissed by user")
          handleCancel()
        }
      } else {
        console.warn("[PWA] userChoice not available - installation may have completed silently")
        setIsInstallPromptVisible(false)
        setInstallEvent(null)
      }
    } catch (error) {
      console.error("[PWA] Installation error:", error instanceof Error ? error.message : String(error))

      if (error instanceof Error && error.message.includes("timeout")) {
        console.warn("[PWA] Installation timed out")
      }

      alert("Installation could not be completed automatically. Please use your browser's menu to install this app.")
    }
  }, [installEvent])

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