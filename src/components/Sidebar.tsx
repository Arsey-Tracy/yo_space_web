import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  Users,
  MessageSquare,
  Radio,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { organization } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'spaces', label: 'Spaces', icon: Users },
    { id: 'broadcasts', label: 'Broadcasts', icon: MessageSquare },
    { id: 'surveys', label: 'Surveys', icon: Radio },
    { id: 'billing', label: 'Wallet & Billing', icon: CreditCard },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen bg-card border-r border-line transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-line">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-[10px] bg-primary flex items-center justify-center shrink-0 shadow-xs">
            <Radio className="w-5 h-5 text-ink font-bold" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-ink">
                  Yo-Spaces
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-paper text-primary border border-line rounded-[6px]">
                  2G
                </span>
              </div>
              <p className="text-[11px] text-muted font-medium truncate">
                {organization?.name || 'Community Voice'}
              </p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-1.5 rounded-[8px] text-muted hover:text-ink hover:bg-paper border border-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-[10px] text-xs font-semibold transition-all group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? 'bg-primary text-ink shadow-xs font-bold'
                  : 'text-muted hover:text-ink hover:bg-paper'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-ink' : 'text-muted group-hover:text-primary'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-[8px] bg-ink text-card text-[11px] font-medium shadow-xl border border-ink opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom SMS Balance Widget */}
      {organization && (
        <div className="p-3 border-t border-line">
          {!isCollapsed ? (
            <div
              onClick={() => setActiveTab('billing')}
              className="p-3 rounded-[10px] bg-paper border border-line cursor-pointer hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">SMS Balance</span>
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-display font-extrabold text-ink">
                  {organization.sms_balance.toLocaleString()}
                </span>
                <span className="text-[10px] text-primary font-semibold group-hover:underline">Top Up &rarr;</span>
              </div>
              {organization.sms_balance <= 50 && (
                <p className="mt-1 text-[10px] text-alert flex items-center gap-1 font-medium">
                  <Zap className="w-3 h-3 shrink-0" /> Low balance warning
                </p>
              )}
            </div>
          ) : (
            <div
              onClick={() => setActiveTab('billing')}
              className="w-12 h-12 mx-auto rounded-[10px] bg-paper border border-line flex items-center justify-center cursor-pointer hover:border-primary text-primary transition-all group relative"
              title={`SMS Balance: ${organization.sms_balance}`}
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-[8px] bg-ink text-card text-[11px] font-bold shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {organization.sms_balance.toLocaleString()} SMS
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
