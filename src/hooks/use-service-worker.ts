// src/hooks/useServiceWorker.ts
import { useEffect } from 'react'
import { Workbox } from 'workbox-window'

interface ServiceWorkerOptions {
  onSuccess?: () => void
  onUpdate?: () => void
}

export const useServiceWorker = (options: ServiceWorkerOptions = {}) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js')

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          console.log('Service worker updated')
          options.onUpdate?.()
        } else {
          console.log('Service worker installed')
          options.onSuccess?.()
        }
      })

      wb.register()
        .then((registration) => {
          console.log('Service Worker registered', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed', error)
        })
    }
  }, [])
}