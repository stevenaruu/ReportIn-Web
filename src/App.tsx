import './App.css'
import { useServiceWorker } from './hooks/use-service-worker'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/root/home-page/home-page'
import FeaturePage from './pages/root/feature-page/feature-page';
import HowItWorkPage from './pages/root/how-it-work-page/how-it-work-page';
import ContactPage from './pages/root/contact-page/contact-page';
import { useContext, useMemo } from 'react';
import { NetworkContext } from './contexts/network/network-context';
import { getSubdomain } from './lib/get-subdomain';
import SubLoginPage from './pages/sub/login-page/login-page';
import SubDashboardPage from './pages/sub/dashboard-page/dashboard-page';
import RootDashboardPage from './pages/root/dashboard-page/dashboard-page';
import { RootPrivateLayout, SubPrivateLayout } from './layouts/private-layout';
import RootLoginPage from './pages/root/login-page/login-page';
import LeaderboardPage from './pages/sub/leaderboard-page/leaderbord-page';
import BrowseReportPage from './pages/sub/browse-report-page/browse-report-page';
import BrowseCategoryPage from './pages/sub/browse-category-page/browse-category-page';
import BrowseAreaPage from './pages/sub/browse-area-page/browse-area-page';
import BrowseAccountPage from './pages/sub/browse-account-page/browse-account-page';

function App() {
  const { isOnline, isServiceWorkerReady } = useContext(NetworkContext)

  console.log("isOnline", isOnline)
  console.log("isServiceWorkerReady", isServiceWorkerReady)

  useServiceWorker({
    onSuccess: () => console.log('Service Worker Successfully Registered'),
    onUpdate: () => console.log('New content available')
  })

  const ROOT_DOMAIN = import.meta.env.VITE_ROOT_DOMAIN ?? 'localhost';

  const { hostname } = window.location;

  const subdomain = useMemo(() => getSubdomain(hostname, ROOT_DOMAIN), [hostname, ROOT_DOMAIN]);
  const isSubdomain = Boolean(subdomain);

  return (
    <BrowserRouter>
      {isSubdomain ? (
        <Routes>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<SubLoginPage />} />


          <Route element={<SubPrivateLayout />}>
            <Route path="/dashboard" element={<SubDashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/browse-report" element={<BrowseReportPage />} />
            <Route path="/browse-category" element={<BrowseCategoryPage />} />
            <Route path="/browse-area" element={<BrowseAreaPage />} />
            <Route path="/browse-account" element={<BrowseAccountPage />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<RootLoginPage />} />
          <Route path="/features" element={<FeaturePage />} />
          <Route path="/how-it-works" element={<HowItWorkPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route element={<RootPrivateLayout />}>
            <Route path="/dashboard" element={<RootDashboardPage />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
