import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Radio, MessageSquare, Users, BarChart3, CreditCard, LogOut, User as UserIcon, Sparkles, PhoneCall, Sun, Moon } from 'lucide-react';

import { Button } from './ui/Button';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, organization, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(isAuthenticated ? 'dashboard' : 'landing'); }}
          className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[10px]" 
          onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'landing')}
        >
          <div className="w-10 h-10 rounded-[10px] bg-primary flex items-center justify-center shadow-xs">
            <Radio className="w-5 h-5 text-ink font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-ink">
                Yo-Spaces
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-paper text-primary border border-line rounded-[10px]">
                2G Voice & SMS
              </span>
            </div>
            {organization && (
              <p className="text-xs text-muted font-medium">{organization.name}</p>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-1 bg-paper p-1.5 rounded-[10px] border border-line">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-ink font-semibold shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-card'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('spaces')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === 'spaces'
                  ? 'bg-primary text-ink font-semibold shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-card'
              }`}
            >
              <Users className="w-4 h-4" /> Spaces
            </button>
            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === 'broadcasts'
                  ? 'bg-primary text-ink font-semibold shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-card'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Broadcasts
            </button>
            <button
              onClick={() => setActiveTab('surveys')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === 'surveys'
                  ? 'bg-primary text-ink font-semibold shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-card'
              }`}
            >
              <Radio className="w-4 h-4" /> Surveys
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === 'billing'
                  ? 'bg-primary text-ink font-semibold shadow-xs'
                  : 'text-muted hover:text-ink hover:bg-card'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Billing
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <button onClick={() => setActiveTab('landing')} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Features</button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-primary transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              <PhoneCall className="w-3.5 h-3.5 text-primary" /> Contact Us
            </button>
          </div>
        )}

        {/* Right CTA / SMS Balance & User Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-[10px] border border-line bg-paper text-ink"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {isAuthenticated && organization && (
            <div
              tabIndex={0}
              role="button"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('billing'); }}
              onClick={() => setActiveTab('billing')}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-paper border border-line hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <div className="text-xs">
                <span className="text-muted font-medium">SMS Balance: </span>
                <span className="font-mono font-bold text-ink">{organization.sms_balance.toLocaleString()}</span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-paper border border-line text-xs font-semibold text-ink">
                <UserIcon className="w-3.5 h-3.5 text-primary" />
                <span>{user?.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                title="Logout"
                className="p-2 rounded-[10px] text-muted hover:text-alert border border-line"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth('login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth('register')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
