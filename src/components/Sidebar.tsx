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
    { id: 'billing', label: 'Wallet', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Sparkles },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen bg-card/95 border-r border-line transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-[4.75rem]' : 'w-64'
      }`}
    >
      <div className="h-16 px-3 flex items-center justify-between border-b border-line">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Radio className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-ink">
                  YoSpaces
                </span>
              </div>
              <p className="text-[11px] text-muted font-medium truncate">
                {organization?.name || 'Organization'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-primary-soft border border-transparent hover:border-line transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-2.5 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-primary text-white shadow-[0_10px_22px_-12px_rgba(240,122,26,0.9)]'
                  : 'text-muted hover:text-ink hover:bg-primary-soft/70'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-muted group-hover:text-primary'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-ink text-card text-[11px] font-medium shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {organization && (
        <div className="p-3 border-t border-line">
          {!isCollapsed ? (
            <div
              onClick={() => setActiveTab('billing')}
              className="p-3.5 rounded-2xl bg-primary-soft border border-line cursor-pointer hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Wallet</span>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-display font-extrabold text-ink">
                  {organization.sms_balance.toLocaleString()}
                </span>
                <span className="text-[10px] text-primary font-semibold">Top up</span>
              </div>
              {organization.sms_balance <= 50 && (
                <p className="mt-1 text-[10px] text-alert flex items-center gap-1 font-medium">
                  <Zap className="w-3 h-3 shrink-0" /> Low balance
                </p>
              )}
            </div>
          ) : (
            <div
              onClick={() => setActiveTab('billing')}
              className="w-12 h-12 mx-auto rounded-2xl bg-primary-soft border border-line flex items-center justify-center cursor-pointer hover:border-primary text-primary transition-all group relative"
              title={`SMS Balance: ${organization.sms_balance}`}
            >
              <Sparkles className="w-5 h-5" />
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-ink text-card text-[11px] font-bold shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {organization.sms_balance.toLocaleString()} SMS
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
