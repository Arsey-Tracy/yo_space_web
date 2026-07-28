import React, { useState, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardOverview } from './components/DashboardOverview';
import { SpaceManager } from './components/SpaceManager';
import { BroadcastStudio } from './components/BroadcastStudio';
import { SurveyBuilder } from './components/SurveyBuilder';
import { BillingPortal } from './components/BillingPortal';

type DashboardTab = 'dashboard' | 'spaces' | 'broadcasts' | 'surveys' | 'billing';

const DASHBOARD_TABS: DashboardTab[] = ['dashboard', 'spaces', 'broadcasts', 'surveys', 'billing'];

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  // Track which dashboard tabs have been visited (lazy-mount)
  const [mountedTabs, setMountedTabs] = useState<Set<DashboardTab>>(new Set());
  const prevAuth = useRef(isAuthenticated);

  // Auto-switch to dashboard on login, reset to landing on logout
  React.useEffect(() => {
    if (isAuthenticated && !prevAuth.current) {
      // Just logged in
      setActiveTab('dashboard');
      setMountedTabs(new Set(['dashboard']));
    }
    if (!isAuthenticated && prevAuth.current) {
      // Just logged out — reset everything
      setActiveTab('landing');
      setMountedTabs(new Set());
    }
    prevAuth.current = isAuthenticated;
  }, [isAuthenticated]);

  // Whenever a dashboard tab is activated, mark it as mounted
  React.useEffect(() => {
    if (isAuthenticated && DASHBOARD_TABS.includes(activeTab as DashboardTab)) {
      setMountedTabs((prev) => {
        if (prev.has(activeTab as DashboardTab)) return prev;
        const next = new Set(prev);
        next.add(activeTab as DashboardTab);
        return next;
      });
    }
  }, [activeTab, isAuthenticated]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!isAuthenticated && tab !== 'landing') {
        setAuthModal({ isOpen: true, mode: 'login' });
        return;
      }
      setActiveTab(tab);
      setMobileSidebarOpen(false);
    },
    [isAuthenticated]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 animate-pulse shadow-lg shadow-teal-500/20" />
          <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Loading Yo-Spaces Engine...</p>
        </div>
      </div>
    );
  }

  const showDashboard = isAuthenticated && activeTab !== 'landing';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      
      {/* Authenticated Dashboard Layout with Sidebar */}
      {showDashboard ? (
        <div className="flex w-full min-h-screen">
          
          {/* Collapsible Left Sidebar (Desktop) */}
          <div className="hidden md:block">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          </div>

          {/* Mobile Sidebar Overlay Drawer */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="relative z-10">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  isCollapsed={false}
                  setIsCollapsed={() => setMobileSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Dashboard Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-950">
            {/* Top Header Bar with Account Avatar & Page Title */}
            <TopHeader
              activeTab={activeTab}
              onNavigate={handleTabChange}
              onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
            />

            {/* Dashboard Workspace */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {mountedTabs.has('dashboard') && (
                <div className={activeTab === 'dashboard' ? 'tab-panel-active' : 'tab-panel-hidden'}>
                  <DashboardOverview onNavigate={handleTabChange} />
                </div>
              )}
              {mountedTabs.has('spaces') && (
                <div className={activeTab === 'spaces' ? 'tab-panel-active' : 'tab-panel-hidden'}>
                  <SpaceManager />
                </div>
              )}
              {mountedTabs.has('broadcasts') && (
                <div className={activeTab === 'broadcasts' ? 'tab-panel-active' : 'tab-panel-hidden'}>
                  <BroadcastStudio />
                </div>
              )}
              {mountedTabs.has('surveys') && (
                <div className={activeTab === 'surveys' ? 'tab-panel-active' : 'tab-panel-hidden'}>
                  <SurveyBuilder />
                </div>
              )}
              {mountedTabs.has('billing') && (
                <div className={activeTab === 'billing' ? 'tab-panel-active' : 'tab-panel-hidden'}>
                  <BillingPortal />
                </div>
              )}
            </main>
          </div>

        </div>
      ) : (
        /* Non-Authenticated / Landing Page Layout */
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          />
          <main className="flex-1">
            <LandingPage onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })} />
          </main>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
