import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Radio, MessageSquare, Users, BarChart3, CreditCard, LogOut, User as UserIcon, Sparkles, PhoneCall, Sun, Moon, Menu, X } from 'lucide-react';

import { Button } from './ui/Button';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const AUTH_NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: BarChart3 },
  { id: 'spaces', label: 'Spaces', icon: Users },
  { id: 'broadcasts', label: 'Broadcasts', icon: MessageSquare },
  { id: 'surveys', label: 'Surveys', icon: Radio },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, organization, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goTo = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <div
          tabIndex={0}
          role="button"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goTo(isAuthenticated ? 'dashboard' : 'landing'); }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[10px]"
          onClick={() => goTo(isAuthenticated ? 'dashboard' : 'landing')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-primary flex items-center justify-center shadow-xs shrink-0">
            <Radio className="w-5 h-5 text-ink font-bold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-ink truncate">
                Yo-Spaces
              </span>
              <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-semibold bg-paper text-primary border border-line rounded-[10px] shrink-0">
                2G Voice & SMS
              </span>
            </div>
            {organization && (
              <p className="text-xs text-muted font-medium truncate">{organization.name}</p>
            )}
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        {isAuthenticated ? (
          <nav className="hidden lg:flex items-center gap-1 bg-paper p-1.5 rounded-[10px] border border-line">
            {AUTH_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    activeTab === item.id
                      ? 'bg-primary text-ink font-semibold shadow-xs'
                      : 'text-muted hover:text-ink hover:bg-card'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <button onClick={() => goTo('landing')} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">Features</button>
            <button onClick={() => goTo('contact')} className="hover:text-primary transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              <PhoneCall className="w-3.5 h-3.5 text-primary" /> Contact Us
            </button>
          </div>
        )}

        {/* Right CTA / SMS Balance & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
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
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goTo('billing'); }}
              onClick={() => goTo('billing')}
              className="hidden sm:flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-[10px] bg-paper border border-line hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <div className="text-xs">
                <span className="text-muted font-medium">SMS Balance: </span>
                <span className="font-mono font-bold text-ink">{organization.sms_balance.toLocaleString()}</span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-paper border border-line text-xs font-semibold text-ink">
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
            <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-[10px] border border-line bg-paper text-ink hover:bg-line/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-line animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">

            {isAuthenticated ? (
              <>
                <div className="space-y-1">
                  {AUTH_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => goTo(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                          activeTab === item.id
                            ? 'bg-primary text-ink font-semibold shadow-xs'
                            : 'text-muted hover:text-ink hover:bg-paper'
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {item.label}
                      </button>
                    );
                  })}
                </div>

                {organization && (
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[10px] bg-paper border border-line">
                    <div className="flex items-center gap-2 text-xs">
                      <UserIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold text-ink">{user?.username}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted font-medium">SMS: </span>
                      <span className="font-mono font-bold text-ink">{organization.sms_balance.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  onClick={logout}
                  className="w-full text-alert border-alert/30 hover:bg-alert/10"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <button
                    onClick={() => goTo('landing')}
                    className="w-full text-left px-3.5 py-2.5 rounded-[10px] text-sm font-medium text-ink hover:bg-paper transition-colors"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => goTo('contact')}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-sm font-medium text-ink hover:bg-paper transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-primary" /> Contact Us
                  </button>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onOpenAuth('login')}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => onOpenAuth('register')}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
