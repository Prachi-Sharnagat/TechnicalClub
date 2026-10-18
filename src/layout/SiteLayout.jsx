import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SECTION_PATHS } from '../lib/sections';
import SiteNav from '../components/site/SiteNav';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

export default function SiteLayout() {
  const { pathname } = useLocation();
  // other pages start at the top (the main page scrolls to its own sections)
  useEffect(() => { if (!SECTION_PATHS.includes(pathname)) window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <SiteNav />
      <Suspense fallback={<div className="route-load">LOADING...</div>}>
        <Outlet />
      </Suspense>
      <Footer text="Technical Club. Build, learn, share." />
      {/* Global TC-BOT Assistant mounted across all site routes */}
      <ChatbotWidget />
    </>
  );
}
