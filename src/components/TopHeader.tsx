import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User as UserIcon,
  LogOut,
  Sparkles,
  Building2,
  ChevronDown,
  Menu,
  Globe,
  Sun,
  Moon,
  Wallet,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../api/translation';

interface TopHeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onToggleMobileSidebar?: () => void;
  selectedLanguage?: string;
  onSelectLanguage?: (langCode: string) => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: 'Real-time metrics for spaces, prepaid wallet, and broadcast history',
  },
  spaces: {
    title: 'Spaces Manager',
    subtitle: 'Manage community spaces, member contacts, CSV imports, and live calls',
  },
  broadcasts: {
    title: 'Broadcast Studio',
    subtitle: 'Compose and dispatch bulk SMS alerts across your 2G spaces',
  },
  surveys: {
    title: 'Survey & Poll Analytics',
    subtitle: 'Build interactive USSD polls and inspect real-time response data',
  },
  billing: {
    title: 'Wallet & Pay-As-You-Go Billing',
    subtitle: 'Manage prepaid wallet balance, view SMS rates, and top up via Mobile Money',
  },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onNavigate,
  onToggleMobileSidebar,
  selectedLanguage = 'en',
  onSelectLanguage,
}) => {
  const { user, organization, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabInfo = TAB_TITLES[activeTab] || {
    title: 'Yo-Spaces Platform',
    subtitle: '2G Voice, USSD, and SMS Community Engine',
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'YS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-card border-b border-line px-3 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs transition-colors">

      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-[8px] text-muted hover:text-ink hover:bg-paper border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-display font-bold text-ink tracking-tight truncate">
            {tabInfo.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-muted truncate">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" ref={dropdownRef}>

        {/* Dark / Light Theme Toggle Switch */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-[10px] bg-paper border border-line text-ink hover:bg-line/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-primary" />
          ) : (
            <Moon className="w-4 h-4 text-muted" />
          )}
        </button>

        {/* Local Language Selector Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setLangDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-paper hover:bg-line/40 border border-line text-xs font-semibold text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Choose Delivery Language"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{currentLang.flag} {currentLang.name}</span>
            <ChevronDown className="w-3 h-3 text-muted" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-[14px] bg-card border border-line shadow-xl p-2 z-50 animate-fadeIn max-h-64 overflow-y-auto">
              <p className="px-3 py-1 text-[10px] font-bold text-muted uppercase tracking-wider">
                African & Regional Languages
              </p>
              <div className="space-y-0.5 mt-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (onSelectLanguage) onSelectLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium transition ${
                      selectedLanguage === lang.code
                        ? 'bg-paper text-primary font-bold border border-line'
                        : 'text-ink hover:bg-paper'
                    }`}
                  >
                    <span>{lang.flag} {lang.name}</span>
                    <span className="text-[10px] text-muted">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet SMS Balance Badge */}
        {organization && (
          <div
            onClick={() => onNavigate('billing')}
            className="cursor-pointer flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-[10px] bg-paper border border-line hover:border-primary transition-all shadow-xs group"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="hidden sm:inline text-muted font-medium">SMS: </span>
              <span className="font-mono font-bold text-ink">{organization.sms_balance.toLocaleString()}</span>
            </div>
            <span className="hidden sm:inline text-[10px] text-primary group-hover:underline font-semibold">&bull; Top Up</span>
          </div>
        )}

        {/* Account Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-[10px] bg-paper border border-line hover:bg-line/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-[8px] bg-primary text-ink font-extrabold text-xs flex items-center justify-center shadow-xs">
              {getInitials(user?.username || organization?.name)}
            </div>

            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-ink truncate max-w-30">
                {user?.username || 'Account'}
              </div>
              <div className="text-[10px] text-muted truncate max-w-30">
                {organization?.name || 'Organization'}
              </div>
            </div>

            <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-[14px] bg-card border border-line shadow-2xl p-2 z-50 animate-fadeIn">

              <div className="p-3 border-b border-line mb-1">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-primary" />
                  {user?.username}
                </p>
                <p className="text-[11px] text-muted mt-0.5 truncate">{user?.email}</p>

                {organization && (
                  <div className="mt-2.5 p-2 rounded-[10px] bg-paper border border-line flex items-center justify-between text-[11px]">
                    <span className="text-ink flex items-center gap-1 font-medium">
                      <Building2 className="w-3 h-3 text-primary" />
                      {organization.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-[6px] bg-success/10 text-success font-bold text-[10px] border border-success/30">
                      PAYG Active
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('billing');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-medium text-ink hover:bg-paper transition"
                >
                  <Wallet className="w-4 h-4 text-primary" />
                  Wallet & Billing
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-line">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-alert hover:bg-alert/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
};
