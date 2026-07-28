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
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading organization metrics...
      </div>
    );
  }

  const isLowBalance = (stats?.sms_balance ?? 0) <= 50;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-semibold border border-teal-500/20">
            {stats?.subscription_tier} Package Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {stats?.organization} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pass communication to your rural spaces through Voice, SMS, and USSD.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('broadcasts')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:brightness-110 transition-all"
          >
            <Send className="w-4 h-4" /> Send Broadcast
          </button>
          <button
            onClick={() => onNavigate('spaces')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Space
          </button>
        </div>
      </div>

      {/* Low Balance Alert Banner */}
      {isLowBalance && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">SMS Credit Balance Low ({stats?.sms_balance} credits left)</p>
              <p className="text-[11px] text-amber-400/80">Top up your balance to ensure broadcast SMS messages deliver uninterrupted.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('billing')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shrink-0 hover:brightness-110 transition-all"
          >
            Buy SMS Bundle
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spaces */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Spaces</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats?.total_spaces}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tier Limit: {stats?.max_spaces_limit} max</span>
            <span className="text-teal-400 font-semibold">{Math.round(((stats?.total_spaces || 0) / (stats?.max_spaces_limit || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((stats?.total_spaces || 0) / (stats?.max_spaces_limit || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Total Members */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Members</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats?.total_members}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Capacity/Space: {stats?.max_members_per_space}</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-full" />
          </div>
        </div>

        {/* SMS Credit Balance */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">SMS Balance</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-cyan-400 mt-3">{stats?.sms_balance.toLocaleString()}</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Credits Remaining</span>
            <button onClick={() => onNavigate('billing')} className="text-cyan-400 font-semibold hover:underline flex items-center gap-0.5">
              Top Up <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full w-3/4" />
          </div>
        </div>

        {/* Broadcasts Sent */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Broadcasts (Month)</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats?.broadcasts_sent_this_month}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Delivered via SMS</span>
            <span className="text-purple-400 font-semibold">100%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-base mb-2">Quick Actions</h3>

          <button
            onClick={() => onNavigate('broadcasts')}
            className="w-full p-4 rounded-xl glass-card text-left hover:border-teal-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Send Broadcast SMS</p>
                <p className="text-[11px] text-slate-400">Notify all space members immediately</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('spaces')}
            className="w-full p-4 rounded-xl glass-card text-left hover:border-teal-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Import Members (CSV)</p>
                <p className="text-[11px] text-slate-400">Bulk upload contacts from Excel/CSV</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('surveys')}
            className="w-full p-4 rounded-xl glass-card text-left hover:border-teal-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Create USSD Survey</p>
                <p className="text-[11px] text-slate-400">Collect real-time poll feedback</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>

        {/* Recent Broadcast Activity */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Recent Broadcast Activity</h3>
            <button onClick={() => onNavigate('broadcasts')} className="text-xs text-teal-400 font-semibold hover:underline">
              View All
            </button>
          </div>

          {!(Array.isArray(stats?.recent_broadcasts) && stats.recent_broadcasts.length > 0) ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No recent broadcasts sent. Click "Send Broadcast" to notify your space.
            </div>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(stats?.recent_broadcasts) ? stats.recent_broadcasts : []).map((b) => (
                <div key={b.id} className="p-4 rounded-xl glass-card flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{b.space_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-300 line-clamp-2">{b.message}</p>
                    <p className="text-[10px] text-slate-500">{new Date(b.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-teal-400">{b.recipients_count} SMS</p>
                    <p className="text-[10px] text-slate-400">{b.cost_credits} Credits</p>
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
