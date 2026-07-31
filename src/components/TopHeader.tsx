import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  LogOut,
  Sparkles,
  Building2,
  ChevronDown,
  Menu,
  ShieldCheck,
  Globe,
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
    subtitle: 'Real-time metrics for spaces, SMS quotas, and broadcast history',
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
    title: 'Billing & SMS Top-Up',
    subtitle: 'Manage subscription tiers and purchase pay-as-you-go SMS bundles',
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
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
            {tabInfo.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-500 truncate">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0" ref={dropdownRef}>
        
        {/* Local Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-800 transition"
            title="Choose Delivery Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-700" />
            <span>{currentLang.flag} {currentLang.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn max-h-64 overflow-y-auto">
              <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedLanguage === lang.code
                        ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{lang.flag} {lang.name}</span>
                    <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SMS Credit Badge */}
        {organization && (
          <div
            onClick={() => onNavigate('billing')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all shadow-xs group"
          >
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="hidden sm:inline text-slate-500 font-medium">SMS: </span>
              <span className="font-bold text-blue-900">{organization.sms_balance.toLocaleString()}</span>
            </div>
            <span className="hidden sm:inline text-[10px] text-blue-700 group-hover:underline font-semibold">&bull; Top Up</span>
          </div>
        )}

        {/* Account Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200/60 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {getInitials(user?.username || organization?.name)}
            </div>

            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {user?.username || 'Account'}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {organization?.name || 'Organization'}
              </div>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-fadeIn">
              
              <div className="p-3 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-700" />
                  {user?.username}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{user?.email}</p>
                
                {organization && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <Building2 className="w-3 h-3 text-blue-600" />
                      {organization.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-200">
                      {organization.subscription_tier}
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Subscription & Billing
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
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
