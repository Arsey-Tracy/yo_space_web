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
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Top Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
            {stats?.subscription_tier} Tier Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.organization} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
            className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 hover:bg-slate-200/80 transition"
          >
            <Plus className="w-4 h-4" /> Add Space
          </button>
        </div>
      </div>

      {/* Low Balance Alert Banner */}
      {isLowBalance && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">SMS Credit Balance Low ({stats?.sms_balance} credits remaining)</p>
              <p className="text-[11px] text-amber-800">Top up your balance to ensure broadcast SMS messages deliver uninterrupted.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('billing')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition"
          >
            Buy SMS Bundle
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spaces */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spaces</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats?.total_spaces}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tier Limit: {stats?.max_spaces_limit} max</span>
            <span className="text-blue-700 font-semibold">{Math.round(((stats?.total_spaces || 0) / (stats?.max_spaces_limit || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200">
            <div
              className="bg-blue-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((stats?.total_spaces || 0) / (stats?.max_spaces_limit || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Members</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats?.total_members}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Capacity/Space: {stats?.max_members_per_space}</span>
            <span className="text-emerald-700 font-semibold">Active</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200">
            <div className="bg-emerald-600 h-full rounded-full w-full" />
          </div>
        </div>

        {/* SMS Credit Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SMS Balance</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-blue-800 mt-3">{stats?.sms_balance.toLocaleString()}</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Credits Remaining</span>
            <button onClick={() => onNavigate('billing')} className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5">
              Top Up <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200">
            <div className="bg-blue-700 h-full rounded-full w-3/4" />
          </div>
        </div>

        {/* Broadcasts Sent */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Broadcasts (Month)</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{stats?.broadcasts_sent_this_month}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Delivered via SMS</span>
            <span className="text-purple-700 font-semibold">100%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200">
            <div className="bg-purple-600 h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base mb-2">Quick Actions</h3>

          <button
            onClick={() => onNavigate('broadcasts')}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-blue-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">Send Broadcast SMS</p>
                <p className="text-[11px] text-slate-500">Notify all space members immediately</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('spaces')}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-blue-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">Import Members (CSV)</p>
                <p className="text-[11px] text-slate-500">Bulk upload contacts from Excel/CSV</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('surveys')}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-blue-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">Create USSD Survey</p>
                <p className="text-[11px] text-slate-500">Collect real-time poll feedback</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
          </button>
        </div>

        {/* Recent Broadcast Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Broadcast Activity</h3>
            <button onClick={() => onNavigate('broadcasts')} className="text-xs text-blue-700 font-semibold hover:underline">
              View All
            </button>
          </div>

          {!(Array.isArray(stats?.recent_broadcasts) && stats.recent_broadcasts.length > 0) ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No recent broadcasts sent. Click "Send Broadcast" to notify your space.
            </div>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(stats?.recent_broadcasts) ? stats.recent_broadcasts : []).map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{b.space_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.status === 'sent' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-700 line-clamp-2">{b.message}</p>
                    <p className="text-[10px] text-slate-400">{new Date(b.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-blue-800">{b.recipients_count} SMS</p>
                    <p className="text-[10px] text-slate-500">{b.cost_credits} Credits</p>
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
