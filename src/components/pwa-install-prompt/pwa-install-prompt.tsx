import { X, Download } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import "./pwa-install-prompt.css"
import { usePrimaryColor } from "@/lib/primary-color"

export default function PWAInstallPrompt() {
  const { BACKGROUND_PRIMARY_COLOR } = usePrimaryColor();
  const { isInstallPromptVisible, isInstalled, handleInstall, handleCancel } = usePWAInstall()

  if (isInstalled || !isInstallPromptVisible) {
    return null
  }

  return (
    <div className="pwa-prompt-overlay">
      <div className="pwa-prompt-dialog">
        {/* Close Button */}
        <button onClick={handleCancel} className="pwa-prompt-close" aria-label="Close install prompt">
          <X size={20} />
        </button>

        {/* Content */}
        <div className="pwa-prompt-content">
          {/* Icon */}
          <div className="pwa-prompt-icon">
            <img src="/icon.png" alt="App icon" />
          </div>

          {/* Text */}
          <div className="pwa-prompt-text">
            <h3 className="pwa-prompt-title">Install app?</h3>
            <p className="pwa-prompt-subtitle">Report In</p>
            <p className="pwa-prompt-description">Quick access to the app from your home screen</p>
          </div>
        </div>

        {/* Actions */}
        <div className="pwa-prompt-actions">
          <button onClick={handleCancel} className="pwa-prompt-btn-secondary">
            Cancel
          </button>
          <button onClick={handleInstall} style={BACKGROUND_PRIMARY_COLOR(0.7)} className="pwa-prompt-btn-primary">
            <Download size={18} />
            Install
          </button>
        </div>
      </div>
    </div>
  )
}