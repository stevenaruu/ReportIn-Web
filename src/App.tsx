import { useContext } from 'react'
import './App.css'
import { useServiceWorker } from './hooks/use-service-worker'
import { NetworkContext } from './contexts/network/network-context'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/core/home-page/HomePage'
import LoginPage from './pages/core/login-page/LoginPage';

function App() {
  const { isOnline, isServiceWorkerReady } = useContext(NetworkContext)

  useServiceWorker({
    onSuccess: () => console.log('Service Worker Successfully Registered'),
    onUpdate: () => console.log('New content available')
  })

  console.log("isOnline", isOnline);
  console.log("isServiceWorkerReady", isServiceWorkerReady);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
