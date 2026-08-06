import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { ContactPage } from './components/ContactPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { PaymentVerificationModal } from './components/PaymentVerificationModal';

type DashboardTab = 'dashboard' | 'spaces' | 'broadcasts' | 'surveys' | 'billing';

const DASHBOARD_TABS: DashboardTab[] = ['dashboard', 'spaces', 'broadcasts', 'surveys', 'billing'];

const ROUTE_PATH_MAP: Record<string, string> = {
  landing: '/',
  dashboard: '/dashboard',
  spaces: '/spaces',
  broadcasts: '/broadcasts',
  surveys: '/surveys',
  billing: '/billing',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

const PATH_ROUTE_MAP: Record<string, string> = {
  '/': 'landing',
  '/dashboard': 'dashboard',
  '/spaces': 'spaces',
  '/broadcasts': 'broadcasts',
  '/surveys': 'surveys',
  '/billing': 'billing',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/terms': 'terms',
};

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, organization } = useAuth();
  
  // Route state initialized from URL location
  const getInitialTab = (): string => {
    const path = window.location.pathname;
    return PATH_ROUTE_MAP[path] || 'landing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  // Track Payment Verification Gate
  const [paymentVerificationGate, setPaymentVerificationGate] = useState<{
    phoneNumber: string;
    amount: number;
    reference: string;
    organizationName?: string;
  } | null>(null);

  // Lazy-mount visited dashboard tabs
  const [mountedTabs, setMountedTabs] = useState<Set<DashboardTab>>(new Set());
  const prevAuth = useRef(isAuthenticated);

  // Sync route changes with HTML5 browser history (pushState & popstate)
  const navigateToTab = useCallback((tab: string, replace: boolean = false) => {
    setActiveTab(tab);
    const targetPath = ROUTE_PATH_MAP[tab] || '/';
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab }, '', targetPath);
      } else {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  }, []);

  // Listen for browser Back/Forward popstate events
  useEffect(() => {
    const handlePopState = () => {
      const currentTab = PATH_ROUTE_MAP[window.location.pathname] || 'landing';
      setActiveTab(currentTab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-switch to dashboard on login or landing on logout
  useEffect(() => {
    if (isAuthenticated && !prevAuth.current) {
      const currentTab = PATH_ROUTE_MAP[window.location.pathname] || 'dashboard';
      const targetTab = DASHBOARD_TABS.includes(currentTab as DashboardTab) ? currentTab : 'dashboard';
      navigateToTab(targetTab, true);
      setMountedTabs(new Set([targetTab as DashboardTab]));
    }
    if (!isAuthenticated && prevAuth.current) {
      navigateToTab('landing', true);
      setMountedTabs(new Set());
    }
    prevAuth.current = isAuthenticated;
  }, [isAuthenticated, navigateToTab]);

  // Mark visited dashboard tabs as mounted
  useEffect(() => {
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
      if (!isAuthenticated && DASHBOARD_TABS.includes(tab as DashboardTab)) {
        setAuthModal({ isOpen: true, mode: 'login' });
        return;
      }

      // Check Payment Verification Gate for protected workspace routes
      if (isAuthenticated && DASHBOARD_TABS.includes(tab as DashboardTab)) {
        const isVerified = localStorage.getItem('payment_verified') === 'true';
        const hasBalance = (organization?.sms_balance ?? 0) > 0;
        
        if (!isVerified && !hasBalance && tab !== 'billing') {
          setPaymentVerificationGate({
            phoneNumber: organization?.owner?.phone || '+256700000000',
            amount: 1000,
            reference: 'MOMO-ACCESS-GATE',
            organizationName: organization?.name,
          });
          return;
        }
      }

      navigateToTab(tab);
      setMobileSidebarOpen(false);
    },
    [isAuthenticated, organization, navigateToTab]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 animate-pulse shadow-lg shadow-blue-700/20" />
          <p className="text-slate-600 text-xs font-bold tracking-wide animate-pulse">
            Loading Yo-Spaces Engine...
          </p>
        </div>
      </div>
    );
  }

  const showDashboard = isAuthenticated && DASHBOARD_TABS.includes(activeTab as DashboardTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans selection:bg-blue-700 selection:text-white overflow-x-hidden transition-colors duration-200">
      
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
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
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
          <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Top Header Bar */}
            <TopHeader
              activeTab={activeTab}
              onNavigate={handleTabChange}
              onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />

            {/* Dashboard Workspace Panels */}
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
        /* Public Pages & Landing Layout */
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          />
          <main className="flex-1">
            {activeTab === 'contact' ? (
              <ContactPage />
            ) : activeTab === 'privacy' ? (
              <PrivacyPage />
            ) : activeTab === 'terms' ? (
              <TermsPage />
            ) : (
              <LandingPage onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })} onNavigate={handleTabChange} />
            )}
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

      {/* Payment Verification Access Gate */}
      {paymentVerificationGate && (
        <PaymentVerificationModal
          isOpen={!!paymentVerificationGate}
          paymentDetails={paymentVerificationGate}
          onComplete={() => {
            localStorage.setItem('payment_verified', 'true');
            setPaymentVerificationGate(null);
          }}
          onCancel={() => {
            setPaymentVerificationGate(null);
            navigateToTab('landing');
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
