import React, { useState, useEffect, useRef } from 'react';
import CinematicIntro from './components/CinematicIntro';
import PageTransitionEffect from './components/PageTransitionEffect';
import TopBar from './navigation/TopBar';
import Sidebar, { DEPARTMENTS } from './navigation/Sidebar';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import WebVerificationBanner from './components/WebVerificationBanner';

// Department Pages
import OverviewPage from './pages/Overview/OverviewPage';
import DigitalTwinPage from './pages/DigitalTwin/DigitalTwinPage';
import TrafficPage from './pages/Traffic/TrafficPage';
import WeatherPage from './pages/Weather/WeatherPage';
import DisasterPage from './pages/Disaster/DisasterPage';
import WastePage from './pages/Waste/WastePage';
import EnvironmentPage from './pages/Environment/EnvironmentPage';
import AIAdvisorPage from './pages/AIAdvisor/AIAdvisorPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import SettingsPage from './pages/Settings/SettingsPage';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState('overview');
  const [navigationMode, setNavigationMode] = useState('single'); // 'single' or 'continuous'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainScrollContainerRef = useRef(null);

  // Handle department selection
  const handleSelectDepartment = (deptId) => {
    setActiveDepartment(deptId);
    setMobileMenuOpen(false); // Close mobile drawer when department is selected
    if (navigationMode === 'continuous') {
      const el = document.getElementById(`section-${deptId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // IntersectionObserver for Continuous Scroll Mode
  useEffect(() => {
    if (navigationMode !== 'continuous' || showIntro) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('section-', '');
            setActiveDepartment(sectionId);
          }
        });
      },
      {
        root: mainScrollContainerRef.current,
        threshold: 0.35
      }
    );

    DEPARTMENTS.forEach((dept) => {
      const el = document.getElementById(`section-${dept.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navigationMode, showIntro]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Cinematic Intro Screen */}
      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Perimeter Scanning Beam Page Transition */}
      <PageTransitionEffect activeDepartment={activeDepartment} />

      {/* Persistent Top Navigation Bar */}
      <TopBar 
        navigationMode={navigationMode}
        setNavigationMode={setNavigationMode}
        aiDrawerOpen={isAiDrawerOpen}
        setAiDrawerOpen={setIsAiDrawerOpen}
        onReplayIntro={() => setShowIntro(true)}
        activeDepartment={activeDepartment}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      />

      {/* Autonomous In-House Web Cross-Verification Bar */}
      <WebVerificationBanner />

      {/* Main Body Layout: Sidebar + Content Viewport + AI Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Persistent Desktop Sidebar & Slide-out Mobile Navigation Drawer */}
        <Sidebar 
          activeDepartment={activeDepartment}
          onSelectDepartment={handleSelectDepartment}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main 
          ref={mainScrollContainerRef}
          className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 transition-all duration-300 w-full ${
            isAiDrawerOpen ? 'mr-0 lg:mr-[420px]' : ''
          }`}
        >
          {navigationMode === 'single' ? (
            /* Method A: Dedicated Single Page View */
            <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
              {activeDepartment === 'overview' && <OverviewPage onNavigateDepartment={handleSelectDepartment} />}
              {activeDepartment === 'digital-twin' && <DigitalTwinPage />}
              {activeDepartment === 'traffic' && <TrafficPage />}
              {activeDepartment === 'weather' && <WeatherPage />}
              {activeDepartment === 'disaster' && <DisasterPage />}
              {activeDepartment === 'waste' && <WastePage />}
              {activeDepartment === 'environment' && <EnvironmentPage />}
              {activeDepartment === 'ai-advisor' && <AIAdvisorPage />}
              {activeDepartment === 'analytics' && <AnalyticsPage />}
              {activeDepartment === 'settings' && <SettingsPage />}
            </div>
          ) : (
            /* Method B: Continuous Scroll Navigation Through All Sections */
            <div className="max-w-7xl mx-auto space-y-16 pb-24">
              <section id="section-overview" className="scroll-mt-6 min-h-[85vh]">
                <OverviewPage onNavigateDepartment={handleSelectDepartment} />
              </section>

              <section id="section-digital-twin" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <DigitalTwinPage />
              </section>

              <section id="section-traffic" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <TrafficPage />
              </section>

              <section id="section-weather" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <WeatherPage />
              </section>

              <section id="section-disaster" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <DisasterPage />
              </section>

              <section id="section-waste" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <WastePage />
              </section>

              <section id="section-environment" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <EnvironmentPage />
              </section>

              <section id="section-ai-advisor" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <AIAdvisorPage />
              </section>

              <section id="section-analytics" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <AnalyticsPage />
              </section>

              <section id="section-settings" className="scroll-mt-6 min-h-[85vh] pt-6 border-t border-slate-800">
                <SettingsPage />
              </section>
            </div>
          )}
        </main>

        {/* Persistent Right AI Assistant Drawer */}
        <AIAssistantDrawer 
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          activeDepartment={activeDepartment}
        />
      </div>

    </div>
  );
}
