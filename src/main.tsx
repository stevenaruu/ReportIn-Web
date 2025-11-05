import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { NetworkProvider } from "./contexts/network/network-context.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "./store.ts"
import { TooltipProvider } from "@radix-ui/react-tooltip"

const queryClient = new QueryClient()

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("[PWA] Service Worker registered:", registration)
    })
    .catch((error) => {
      console.log("[PWA] Service Worker registration failed:", error)
    })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <TooltipProvider delayDuration={0}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </TooltipProvider>
      </NetworkProvider>
    </QueryClientProvider>
  </StrictMode>
)