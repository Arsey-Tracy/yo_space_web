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
    { id: 'billing', label: 'Billing & Top-Up', icon: CreditCard },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
            <Radio className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-teal-400 bg-clip-text text-transparent">
                  Yo-Spaces
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded">
                  2G
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {organization?.name || 'Community Voice'}
              </p>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : 'group-hover:text-teal-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-medium shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom SMS Balance Widget */}
      {organization && (
        <div className="p-3 border-t border-slate-800/80">
          {!isCollapsed ? (
            <div
              onClick={() => setActiveTab('billing')}
              className="glass-card p-3 rounded-xl cursor-pointer hover:border-teal-500/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SMS Credit Balance</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-teal-400">
                  {organization.sms_balance.toLocaleString()}
                </span>
                <span className="text-[10px] text-teal-400/80 group-hover:underline">Top Up &rarr;</span>
              </div>
              {organization.sms_balance <= 50 && (
                <p className="mt-1 text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                  <Zap className="w-3 h-3 shrink-0" /> Low balance warning
                </p>
              )}
            </div>
          ) : (
            <div
              onClick={() => setActiveTab('billing')}
              className="w-12 h-12 mx-auto rounded-xl glass-card flex items-center justify-center cursor-pointer hover:border-teal-500/50 text-teal-400 transition-all group relative"
              title={`SMS Balance: ${organization.sms_balance}`}
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-teal-400 text-[11px] font-bold shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {organization.sms_balance.toLocaleString()} SMS
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
