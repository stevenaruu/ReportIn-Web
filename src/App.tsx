import './App.css'
import { useServiceWorker } from './hooks/use-service-worker'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/root/home-page/home-page'
import FeaturePage from './pages/root/feature-page/feature-page';
import HowItWorkPage from './pages/root/how-it-work-page/how-it-work-page';
import ContactPage from './pages/root/contact-page/contact-page';
import { useContext, useMemo } from 'react';
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
import SubLogoutPage from './pages/sub/logout-page/logout-page';
import BrowseAccountDetailPage from './pages/sub/browse-account-detail-page/browse-account-detail-page';
import ReportPage from './pages/sub/report-page/report-page';
import { useGetCampusBySubDomain } from './api/services/campus';
import LoadingPage from './pages/sub/loading/loading-page';
import NotFoundPage from './pages/sub/not-found-page/not-found-page';
import { useDispatch } from 'react-redux';
import { setCampus } from './store/campus/slice';
import { NetworkContext } from './contexts/network/network-context';
import CreateAreaPage from './pages/sub/create-area-page/create-area-page';
import EditAreaPage from './pages/sub/edit-area-page/edit-area-page';
import CreateCategoryPage from './pages/sub/create-category-page/create-category-page';
import EditCategoryPage from './pages/sub/edit-category-page/edit-category-page';
import RootLogoutPage from './pages/root/logout-page/logout-page';
import ReportDetailPage from './pages/sub/report-detail-page/report-detail-page';
import CreateCampusPage from './pages/sub/create-campus-page/create-campus-page';
import EditCampusPage from './pages/sub/edit-campus-page/edit-campus-page';

function App() {
  useServiceWorker({
    onSuccess: () => { },
    onUpdate: () => { }
  })

  const dispatch = useDispatch();

  const ROOT_DOMAIN = import.meta.env.VITE_ROOT_DOMAIN ?? 'localhost';

  const { hostname } = window.location;
  const { isOnline } = useContext(NetworkContext);

  const subdomain = useMemo(() => getSubdomain(hostname, ROOT_DOMAIN), [hostname, ROOT_DOMAIN]);
  const isSubdomain = Boolean(subdomain);

  const { data, isLoading, error } = useGetCampusBySubDomain(
    { subdomain: subdomain ?? "" },
    { enabled: isSubdomain }
  );

  if (isSubdomain && isOnline) {
    if (isLoading) return <LoadingPage />
    if (error) return <NotFoundPage />
    if (data) {
      dispatch(setCampus(data.data));
    }
  }

  return (
    <BrowserRouter>
      {isSubdomain ? (
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<SubLoginPage />} />
          <Route path="/logout" element={<SubLogoutPage />} />

          <Route element={<SubPrivateLayout />}>
            <Route path="/dashboard" element={<SubDashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/browse-report" element={<BrowseReportPage />} />
            <Route path="/browse-category" element={<BrowseCategoryPage />} />
            <Route path="/browse-category/create" element={<CreateCategoryPage />} />
            <Route path="/browse-category/edit/:categoryId" element={<EditCategoryPage />} />
            <Route path="/browse-area" element={<BrowseAreaPage />} />
            <Route path="/browse-area/create" element={<CreateAreaPage />} />
            <Route path="/browse-area/edit/:areaId" element={<EditAreaPage />} />
            <Route path="/browse-account" element={<BrowseAccountPage />} />
            <Route path="/browse-account/:personId" element={<BrowseAccountDetailPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/report/view/:reportId" element={<ReportDetailPage />} />
            <Route path="/report/edit/:reportId" element={<ReportDetailPage />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<RootLoginPage />} />
          <Route path="/features" element={<FeaturePage />} />
          <Route path="/how-it-works" element={<HowItWorkPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/logout" element={<RootLogoutPage />} />

          <Route element={<RootPrivateLayout />}>
            <Route path="/dashboard" element={<RootDashboardPage />} />
            <Route path="/campus" element={<CreateCampusPage />} />
            <Route path="/campus/edit/:campusId" element={<EditCampusPage />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
