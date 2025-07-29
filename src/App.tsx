import './App.css'
import { useServiceWorker } from './hooks/use-service-worker'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/core/home-page/home-page'
import LoginPage from './pages/core/login-page/login-page';
import DashboardPage from './pages/core/dashboard-page/dashboard-page';
import PrivateLayout from './layouts/private-layout';
import FeaturePage from './pages/core/feature-page/feature-page';
import HowItWorkPage from './pages/core/how-it-work-page/how-it-work-page';
import ContactPage from './pages/core/contact-page/contact-page';

function App() {
  useServiceWorker({
    onSuccess: () => console.log('Service Worker Successfully Registered'),
    onUpdate: () => console.log('New content available')
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/features" element={<FeaturePage />} />
        <Route path="/how-it-works" element={<HowItWorkPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
