import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { DashboardStats } from '../types';
import { Users, Radio, MessageSquare, Sparkles, Plus, Send, AlertTriangle, ArrowUpRight } from 'lucide-react';

import { Card } from './ui/Card';
import { Button } from './ui/Button';

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
      <div className="py-20 text-center text-muted text-sm font-medium">
        Loading organization metrics...
      </div>
    );
  }

  const isLowBalance = (stats?.sms_balance ?? 0) <= 50;

  return (
    <div className="space-y-8 font-sans text-ink">
      
      {/* Top Welcome Banner */}
      <Card className="p-6 sm:p-8 rounded-[10px] border-line shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="px-2.5 py-1 rounded-[10px] bg-paper text-success text-[11px] font-semibold border border-line">
            Pay-As-You-Go (PAYG) Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-2">
            {stats?.organization} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Pass communications smoothly across your 2G spaces through Voice, SMS, and USSD.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('broadcasts')}
          >
            <Send className="w-4 h-4" /> Send Broadcast
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('spaces')}
          >
            <Plus className="w-4 h-4" /> Add Space
          </Button>
        </div>
      </Card>

      {/* Low Balance Alert Banner */}
      {isLowBalance && (
        <div className="p-4 rounded-[10px] bg-paper border border-line text-alert text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-alert shrink-0" />
            <div>
              <p className="font-bold">SMS Credit Balance Low ({stats?.sms_balance} credits remaining)</p>
              <p className="text-[11px] text-muted">Top up your prepaid wallet to ensure broadcast SMS messages deliver uninterrupted.</p>
            </div>
          </div>
          <Button
            variant="alert"
            size="sm"
            onClick={() => onNavigate('billing')}
          >
            Top Up Wallet
          </Button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spaces */}
        <Card className="p-6 rounded-[10px] border-line shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Spaces</span>
            <div className="p-2 rounded-[10px] bg-paper text-primary border border-line">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-ink mt-3">{stats?.total_spaces}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
            <span>Pay-As-You-Go</span>
            <span className="text-primary font-semibold">Unlimited</span>
          </div>
          <div className="w-full bg-paper h-1.5 rounded-[10px] mt-1.5 overflow-hidden border border-line">
            <div className="bg-primary h-full rounded-[10px] w-full" />
          </div>
        </Card>

        {/* Total Members */}
        <Card className="p-6 rounded-[10px] border-line shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Members</span>
            <div className="p-2 rounded-[10px] bg-paper text-success border border-line">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-ink mt-3">{stats?.total_members}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
            <span>Contact Directory</span>
            <span className="text-success font-semibold">Active</span>
          </div>
          <div className="w-full bg-paper h-1.5 rounded-[10px] mt-1.5 overflow-hidden border border-line">
            <div className="bg-success h-full rounded-[10px] w-full" />
          </div>
        </Card>

        {/* SMS Credit Balance */}
        <Card className="p-6 rounded-[10px] border-line shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">SMS Balance</span>
            <div className="p-2 rounded-[10px] bg-paper text-primary border border-line">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-primary mt-3 font-mono">
            {stats?.sms_balance.toLocaleString()} <span className="text-xs font-sans font-normal text-muted">SMS</span>
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-muted font-mono">
              ~UGX {((stats?.sms_balance ?? 0) * 40).toLocaleString()} value
            </span>
            <button onClick={() => onNavigate('billing')} className="text-primary font-semibold hover:underline flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              Top Up <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-full bg-paper h-1.5 rounded-[10px] mt-1.5 overflow-hidden border border-line">
            <div className="bg-primary h-full rounded-[10px] w-3/4" />
          </div>
        </Card>

        {/* Broadcasts Sent */}
        <Card className="p-6 rounded-[10px] border-line shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Broadcasts (Month)</span>
            <div className="p-2 rounded-[10px] bg-paper text-primary border border-line">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-ink mt-3">{stats?.broadcasts_sent_this_month}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
            <span>Delivered via SMS</span>
            <span className="text-success font-semibold">100%</span>
          </div>
          <div className="w-full bg-paper h-1.5 rounded-[10px] mt-1.5 overflow-hidden border border-line">
            <div className="bg-primary h-full rounded-[10px] w-full" />
          </div>
        </Card>
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <Card className="p-6 rounded-[10px] border-line shadow-xs space-y-4">
          <h3 className="font-display font-bold text-ink text-base mb-2">Quick Actions</h3>

          <Button variant="primary" size="md" onClick={() => onNavigate('broadcasts')}>
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-[10px] bg-card text-primary border border-line group-hover:bg-primary group-hover:text-ink transition-colors">
      <Send className="w-5 h-5" />
    </div>
    <div>
      <p className="font-bold text-ink text-xs">Send Broadcast SMS</p>
      <p className="text-[11px] text-muted">Notify all space members immediately</p>
    </div>
  </div>
  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
</Button>

          <Button variant="outline" size="md" onClick={() => onNavigate('spaces')}>
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-[10px] bg-card text-success border border-line group-hover:bg-primary group-hover:text-ink transition-colors">
      <Users className="w-5 h-5" />
    </div>
    <div>
      <p className="font-bold text-ink text-xs">Import Members (CSV)</p>
      <p className="text-[11px] text-muted">Bulk upload contacts from Excel/CSV</p>
    </div>
  </div>
  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
</Button>

<Button variant="primary" size="md" onClick={() => onNavigate('surveys')}>
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-[10px] bg-card text-primary border border-line group-hover:bg-primary group-hover:text-ink transition-colors">
      <Radio className="w-5 h-5" />
    </div>
    <div>
      <p className="font-bold text-ink text-xs">Create USSD Survey</p>
      <p className="text-[11px] text-muted">Collect real-time poll feedback</p>
    </div>
  </div>
  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
</Button>
        </Card>

        {/* Recent Broadcast Activity */}
        <Card className="p-6 rounded-[10px] border-line shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-ink text-base">Recent Broadcast Activity</h3>
            <button onClick={() => onNavigate('broadcasts')} className="text-xs text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              View All
            </button>
          </div>

          {!(Array.isArray(stats?.recent_broadcasts) && stats.recent_broadcasts.length > 0) ? (
            <div className="py-12 text-center text-muted text-xs">
              No recent broadcasts sent. Click "Send Broadcast" to notify your space.
            </div>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(stats?.recent_broadcasts) ? stats.recent_broadcasts : []).map((b) => (
                <div key={b.id} className="p-4 rounded-[10px] bg-paper border border-line flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{b.space_name}</span>
                      <span className={`px-2 py-0.5 rounded-[10px] text-[10px] font-semibold border border-line ${
                        b.status === 'sent' ? 'bg-paper text-success' : 'bg-paper text-muted'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-ink line-clamp-2">{b.message}</p>
                    <p className="text-[10px] text-muted font-mono">{new Date(b.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <p className="font-bold text-primary">{b.recipients_count} SMS</p>
                    <p className="text-[10px] text-muted">{b.cost_credits} Credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};
