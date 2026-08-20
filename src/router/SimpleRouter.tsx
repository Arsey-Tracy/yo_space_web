import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { TopHeader } from '../components/TopHeader';

const LandingPage = lazy(() => import('../components/LandingPage').then(m => ({ default: (m as any).LandingPage })) as any);
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: (m as any).LoginPage })) as any);
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: (m as any).RegisterPage })) as any);
const ContactPage = lazy(() => import('../components/ContactPage').then(m => ({ default: (m as any).ContactPage })) as any);
const PrivacyPage = lazy(() => import('../components/PrivacyPage').then(m => ({ default: (m as any).PrivacyPage })) as any);
const TermsPage = lazy(() => import('../components/TermsPage').then(m => ({ default: (m as any).TermsPage })) as any);
const DashboardOverview = lazy(() => import('../components/DashboardOverview').then(m => ({ default: (m as any).DashboardOverview })) as any);
const SpaceManager = lazy(() => import('../components/SpaceManager').then(m => ({ default: (m as any).SpaceManager })) as any);
const BroadcastStudio = lazy(() => import('../components/BroadcastStudio').then(m => ({ default: (m as any).BroadcastStudio })) as any);
const SurveyBuilder = lazy(() => import('../components/SurveyBuilder').then(m => ({ default: (m as any).SurveyBuilder })) as any);
const BillingPortal = lazy(() => import('../components/BillingPortal').then(m => ({ default: (m as any).BillingPortal })) as any);
const SettingsPage = lazy(() => import('../components/SettingsPage').then(m => ({ default: (m as any).SettingsPage })) as any);

function resolveComponent(path: string, isAuthenticated: boolean) {
  const p = path.replace(/\/?$/, '');
  if (isAuthenticated && (p === '' || p === '/' || p === '/login' || p === '/register')) return DashboardOverview;
  if (p === '' || p === '/') return LandingPage;
  if (p === '/login') return LoginPage;
  if (p === '/register') return RegisterPage;
  if (p === '/contact') return ContactPage;
  if (p === '/privacy') return PrivacyPage;
  if (p === '/terms') return TermsPage;
  if (p === '/dashboard/settings') return SettingsPage;
  if (p.startsWith('/dashboard')) return DashboardOverview;
  return LandingPage;
}

function resolveDashboardTab(path: string): string {
  const p = path.replace(/\/?$/, '');
  if (p === '/dashboard' || p === '/dashboard/') return 'dashboard';
  if (p === '/dashboard/spaces') return 'spaces';
  if (p === '/dashboard/broadcasts') return 'broadcasts';
  if (p === '/dashboard/surveys') return 'surveys';
  if (p === '/dashboard/billing') return 'billing';
  if (p === '/dashboard/settings') return 'settings';
  return 'dashboard';
}

export const SimpleRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname || '/');
  const [activeTab, setActiveTab] = useState<string>(() => resolveDashboardTab(window.location.pathname || '/'));
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && (path === '/' || path === '/login' || path === '/register')) {
      navigate('/dashboard');
      return;
    }

    if (isAuthenticated && path === '/contact') {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, path]);

  useEffect(() => {
    const nextTab = path.startsWith('/dashboard') ? resolveDashboardTab(path) : 'landing';
    setActiveTab(nextTab);
  }, [path]);

  const isDashboardRoute = path.startsWith('/dashboard');
  const Component = useMemo(() => resolveComponent(path, isAuthenticated), [path, isAuthenticated]);

  const onOpenAuth = (mode: 'login' | 'register') => {
    if (mode === 'login') navigate('/login');
    else navigate('/register');
  };

  const onNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'landing') return navigate(isAuthenticated ? '/dashboard' : '/');
    if (tab === 'contact') return navigate(isAuthenticated ? '/dashboard' : '/contact');
    if (tab === 'privacy') return navigate(isAuthenticated ? '/dashboard' : '/privacy');
    if (tab === 'terms') return navigate(isAuthenticated ? '/dashboard' : '/terms');
    if (tab === 'dashboard') return navigate('/dashboard');
    if (tab === 'settings') return navigate('/dashboard/settings');
    return navigate(`/dashboard/${tab}`);
  };

  const renderDashboardPanel = () => {
    switch (activeTab) {
      case 'spaces':
        return <SpaceManager />;
      case 'broadcasts':
        return <BroadcastStudio />;
      case 'surveys':
        return <SurveyBuilder />;
      case 'billing':
        return <BillingPortal />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview onNavigate={onNavigate} />;
    }
  };

  if (isDashboardRoute) {
    return (
      <div className="min-h-screen bg-paper text-ink ys-glow">
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => onNavigate(tab)}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          <div className="flex min-w-0 flex-1 flex-col bg-paper">
            <TopHeader
              activeTab={activeTab}
              onNavigate={onNavigate}
              onToggleMobileSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />

            <main className="flex-1 overflow-y-auto bg-transparent">
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
                <Suspense fallback={<div className="p-8 text-sm text-muted">Loading dashboard...</div>}>
                  {renderDashboardPanel()}
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenAuth={onOpenAuth} onNavigate={onNavigate} />
      <main>
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <Component onOpenAuth={onOpenAuth} onNavigate={onNavigate} />
        </Suspense>
      </main>
    </div>
  );
};

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default SimpleRouter;
