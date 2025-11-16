import { useEffect, useState, useCallback } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

interface UsePWAInstallReturn {
  isInstallPromptVisible: boolean
  isInstalled: boolean
  showInstallPrompt: () => void
  hideInstallPrompt: () => void
  handleInstall: () => Promise<void>
  handleCancel: () => void
  resetDismissalState: () => void
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
  const [hasCheckedDismissal, setHasCheckedDismissal] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("[PWA] App is already installed (standalone mode detected)")
      setIsInstalled(true)
      return
    }

    const navigatorWithStandalone = navigator as NavigatorWithStandalone
    if (navigatorWithStandalone.standalone === true) {
      console.log("[PWA] App is already installed (standalone property detected)")
      setIsInstalled(true)
      return
    }

    // For Android Chrome, check if the app is in the app drawer
    if (
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      window.matchMedia("(display-mode: browser)").matches
    ) {
      console.log("[PWA] Display mode detected:", window.matchMedia("(display-mode: standalone)").media)
    }
  }, [])

  useEffect(() => {
    const storedDismissalTime = localStorage.getItem("pwaInstallDismissedUntil")
    if (storedDismissalTime) {
      const dismissUntil = Number.parseInt(storedDismissalTime)
      const now = Date.now()
      
      if (dismissUntil > now) {
        console.log("[PWA] Install prompt dismissed until:", new Date(dismissUntil).toLocaleString())
        setDismissedUntil(dismissUntil)
      } else {
        console.log("[PWA] Dismissal period expired, clearing it")
        localStorage.removeItem("pwaInstallDismissedUntil")
      }
    }
    
    setHasCheckedDismissal(true)
    console.log("[PWA] Dismissal state initialized")
  }, [])

  const handleCancel = useCallback(() => {
    // Dismiss for 24 hours
    const dismissUntil = Date.now() + 24 * 60 * 60 * 1000
    setDismissedUntil(dismissUntil)
    localStorage.setItem("pwaInstallDismissedUntil", dismissUntil.toString())
    setIsInstallPromptVisible(false)
    console.log("[PWA] Installation prompt dismissed for 24 hours")
  }, [])

  const resetDismissalState = useCallback(() => {
    console.log("[PWA] Resetting dismissal state")
    localStorage.removeItem("pwaInstallDismissedUntil")
    setDismissedUntil(null)
    setInstallEvent(null)
    setIsInstallPromptVisible(false)
    console.log("[PWA] Dismissal state cleared - prompt will show on next eligibility")
  }, [])

  useEffect(() => {
    // Wait until dismissal state is loaded before setting up listeners
    if (!hasCheckedDismissal) {
      console.log("[PWA] Waiting for dismissal state to load...")
      return
    }

    if (isInstalled) {
      console.log("[PWA] App already installed, skipping PWA prompt setup")
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("[PWA] beforeinstallprompt event triggered")

      if (!isSubdomainOnly()) {
        console.log("[PWA] Root domain detected - PWA prompt disabled on root domain")
        return
      }

      e.preventDefault()

      const now = Date.now()
      if (dismissedUntil && now < dismissedUntil) {
        console.log("[PWA] Install prompt is currently dismissed, skipping")
        return
      }

      const beforeInstallEvent = e as BeforeInstallPromptEvent
      if (!beforeInstallEvent.prompt) {
        console.warn("[PWA] beforeinstallprompt event missing prompt method")
        return
      }

      console.log("[PWA] beforeinstallprompt event is valid, setting up install")
      setInstallEvent(beforeInstallEvent)
      setIsInstallPromptVisible(true)
      console.log("[PWA] Install prompt ready and visible")
    }

    const handleAppInstalled = () => {
      console.log("[PWA] appinstalled event fired - app successfully installed")
      setIsInstalled(true)
      setIsInstallPromptVisible(false)
      setInstallEvent(null)
      localStorage.removeItem("pwaInstallDismissedUntil")
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [dismissedUntil, hasCheckedDismissal, isInstalled])

  const showInstallPrompt = useCallback(() => {
    if (isInstalled) {
      console.log("[PWA] Cannot show prompt - app is already installed")
      return
    }
    if (!installEvent) {
      console.log("[PWA] Cannot show prompt - no install event available")
      return
    }
    setIsInstallPromptVisible(true)
    console.log("[PWA] Install prompt shown manually")
  }, [isInstalled, installEvent])

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
          localStorage.removeItem("pwaInstallDismissedUntil")
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
  }, [installEvent, handleCancel])

  return {
    isInstallPromptVisible,
    isInstalled,
    showInstallPrompt,
    hideInstallPrompt,
    handleInstall,
    handleCancel,
    resetDismissalState,
  }
}