import React, { createContext, useState, useEffect, ReactNode } from 'react'

interface NetworkContextType {
  isOnline: boolean
  isServiceWorkerReady: boolean
}

export const NetworkContext = createContext<NetworkContextType>({
  isOnline: navigator.onLine,
  isServiceWorkerReady: false
})

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerReady(true)
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <NetworkContext.Provider value={{ isOnline, isServiceWorkerReady }}>
      {children}
    </NetworkContext.Provider>
  )
}