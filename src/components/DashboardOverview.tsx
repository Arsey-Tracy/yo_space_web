import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { DashboardStats } from '../types';
import { Users, Radio, MessageSquare, Sparkles, Plus, Send, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get<DashboardStats>('/dashboard/stats/');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm font-medium">
        Loading organization metrics...
      </div>
    );
  }

  const isLowBalance = (stats?.sms_balance ?? 0) <= 50;

  return (
    <div className="space-y-8 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Top Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="relative z-10">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
            Pay-As-You-Go (PAYG) Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats?.organization} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pass communications smoothly across your 2G spaces through Voice, SMS, and USSD.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('broadcasts')}
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Send className="w-4 h-4" /> Send Broadcast
          </button>
          <button
            onClick={() => onNavigate('spaces')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Space
          </button>
        </div>
      </div>

      {/* Low Balance Alert Banner */}
      {isLowBalance && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">SMS Credit Balance Low ({stats?.sms_balance} credits remaining)</p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">Top up your prepaid wallet to ensure broadcast SMS messages deliver uninterrupted.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('billing')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition"
          >
            Top Up Wallet
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spaces */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Spaces</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats?.total_spaces}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Pay-As-You-Go</span>
            <span className="text-blue-700 dark:text-blue-400 font-semibold">Unlimited</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-blue-700 dark:bg-blue-500 h-full rounded-full w-full" />
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Members</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats?.total_members}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Contact Directory</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Active</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full w-full" />
          </div>
        </div>

        {/* SMS Credit Balance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SMS Balance</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-blue-800 dark:text-blue-400 mt-3">
            {stats?.sms_balance.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">SMS</span>
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              ~UGX {((stats?.sms_balance ?? 0) * 40).toLocaleString()} value
            </span>
            <button onClick={() => onNavigate('billing')} className="text-blue-700 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5">
              Top Up <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-blue-700 dark:bg-blue-500 h-full rounded-full w-3/4" />
          </div>
        </div>

        {/* Broadcasts Sent */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Broadcasts (Month)</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats?.broadcasts_sent_this_month}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Delivered via SMS</span>
            <span className="text-purple-700 dark:text-purple-400 font-semibold">100%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-purple-600 dark:bg-purple-500 h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Quick Actions</h3>

          <button
            onClick={() => onNavigate('broadcasts')}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 dark:hover:border-blue-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Send Broadcast SMS</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Notify all space members immediately</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('spaces')}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 dark:hover:border-blue-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Import Members (CSV)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Bulk upload contacts from Excel/CSV</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('surveys')}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 dark:hover:border-blue-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Create USSD Survey</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Collect real-time poll feedback</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors" />
          </button>
        </div>

        {/* Recent Broadcast Activity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Broadcast Activity</h3>
            <button onClick={() => onNavigate('broadcasts')} className="text-xs text-blue-700 dark:text-blue-400 font-semibold hover:underline">
              View All
            </button>
          </div>

          {!(Array.isArray(stats?.recent_broadcasts) && stats.recent_broadcasts.length > 0) ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              No recent broadcasts sent. Click "Send Broadcast" to notify your space.
            </div>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(stats?.recent_broadcasts) ? stats.recent_broadcasts : []).map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{b.space_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.status === 'sent' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{b.message}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(b.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-blue-800 dark:text-blue-400">{b.recipients_count} SMS</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{b.cost_credits} Credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
