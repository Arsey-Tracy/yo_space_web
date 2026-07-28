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
} from 'lucide-react';

interface TopHeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onToggleMobileSidebar?: () => void;
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
}) => {
  const { user, organization, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabInfo = TAB_TITLES[activeTab] || {
    title: 'Yo-Spaces Platform',
    subtitle: '2G Voice, USSD, and SMS Community Engine',
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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
    <header className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {tabInfo.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-400 truncate">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions: SMS Quick Badge & Account Avatar Menu */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* SMS Credit Badge */}
        {organization && (
          <div
            onClick={() => onNavigate('billing')}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-teal-500/30 hover:border-teal-500/60 transition-all shadow-sm group"
          >
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="hidden sm:inline text-slate-400">SMS: </span>
              <span className="font-bold text-teal-400">{organization.sms_balance.toLocaleString()}</span>
            </div>
            <span className="hidden sm:inline text-[10px] text-teal-400/70 group-hover:text-teal-300 font-semibold">&bull; Top Up</span>
          </div>
        )}

        {/* User Account Avatar Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            {/* Avatar Pill */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-md shadow-teal-500/20">
              {getInitials(user?.username || organization?.name)}
            </div>

            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                {user?.username || 'Account'}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {organization?.name || 'Organization'}
              </div>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn">
              
              {/* Account Info Header */}
              <div className="p-3 border-b border-slate-800/80 mb-1">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-teal-400" />
                  {user?.username}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user?.email}</p>
                
                {organization && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      {organization.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold text-[10px] border border-teal-500/20">
                      {organization.subscription_tier}
                    </span>
                  </div>
                )}
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('billing');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Subscription & Billing
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-1 mt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
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
