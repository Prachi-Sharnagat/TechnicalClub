import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from './layout/SiteLayout';
import MainPage from './pages/MainPage';

// Heavier pages load only when visited (the register page brings Firebase with it)
const WebDevPage = lazy(() => import('./pages/WebDevPage'));
const GraphicsPage = lazy(() => import('./pages/GraphicsPage'));
const ElectronicsPage = lazy(() => import('./pages/ElectronicsPage'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const PublicityPage = lazy(() => import('./pages/PublicityPage'));
const ThreeDModellingPage = lazy(() => import('./pages/ThreeDModellingPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/domains/web-dev" element={<WebDevPage />} />
        <Route path="/domains/graphics" element={<GraphicsPage />} />
        <Route path="/domains/electronics" element={<ElectronicsPage />} />
        <Route path="/domains/video-editing" element={<VideoPage />} />
        <Route path="/domains/publicity" element={<PublicityPage />} />
        <Route path="/domains/3d-modelling" element={<ThreeDModellingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* /, /domains, /members, /events: one page, one scroll */}
        <Route path="*" element={<MainPage />} />
      </Route>
    </Routes>
  );
}
