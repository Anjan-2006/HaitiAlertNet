
import React, { useEffect, useRef } from 'react';
import { Page } from './types';
import { useAppContext } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // Ensure this path is relative, as '@/' aliases are not configured in index.html.
import LiveMapPage from './pages/LiveMapPage';
import ReportDisasterPage from './pages/ReportDisasterPage';
import ReliefResourcesPage from './pages/ReliefResourcesPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import NewsDetailPage from './pages/NewsDetailPage'; 
import LoadingSpinner from './components/LoadingSpinner';


const App: React.FC = () => {
  const { currentPage, isLoading, fontSize, contrastMode } = useAppContext();
  const appWrapperRef = useRef<HTMLDivElement>(null);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage />;
      case Page.LiveMap:
        return <LiveMapPage />;
      case Page.ReportDisaster:
        return <ReportDisasterPage />;
      case Page.ReliefResources:
        return <ReliefResourcesPage />;
      case Page.AdminVerification:
        return <AdminVerificationPage />;
      case Page.NewsDetail: 
        return <NewsDetailPage />;
      default:
        return <HomePage />;
    }
  };
  
  const appStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`, 
    // Background is now handled by useEffect below
  };

  useEffect(() => {
    if (appWrapperRef.current) {
      let bgVar = '';
      switch (currentPage) {
        case Page.Home:
          bgVar = contrastMode ? 'var(--home-bg-dark)' : 'var(--home-bg-light)';
          break;
        case Page.LiveMap:
          bgVar = contrastMode ? 'var(--map-bg-dark)' : 'var(--map-bg-light)';
          break;
        case Page.ReportDisaster:
          bgVar = contrastMode ? 'var(--report-bg-dark)' : 'var(--report-bg-light)';
          break;
        case Page.ReliefResources:
          bgVar = contrastMode ? 'var(--resources-bg-dark)' : 'var(--resources-bg-light)';
          break;
        case Page.AdminVerification:
          bgVar = contrastMode ? 'var(--admin-bg-dark)' : 'var(--admin-bg-light)';
          break;
        case Page.NewsDetail:
          bgVar = contrastMode ? 'var(--newsdetail-bg-dark)' : 'var(--newsdetail-bg-light)';
          break;
        default:
          bgVar = contrastMode ? 'var(--dm-bg-color)' : 'var(--light-bg-start)'; 
      }
      appWrapperRef.current.style.background = bgVar;
    }
  }, [currentPage, contrastMode]);


  return (
    <div ref={appWrapperRef} className="min-h-screen flex flex-col transition-background duration-300 ease-in-out" style={appStyle}>
      {isLoading && <LoadingSpinner />}
      <Navbar />
      <main 
        className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 animated-element animate-fadeIn" 
        style={{ animationDuration: '0.5s' }} // Ensure main content fades in
      >
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;