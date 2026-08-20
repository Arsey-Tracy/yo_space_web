import React from 'react';
import { useDashboardStats } from '../features/dashboard/hooks';
import { Users, Radio, MessageSquare, Sparkles, Plus, Send, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface DashboardOverviewProps { onNavigate: (tab: string) => void }

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const shouldReduce = useReducedMotion();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 rounded-3xl bg-card border border-line" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-card border border-line" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="text-alert text-sm font-medium mb-4">Failed to load dashboard</div>
        <p className="text-muted text-xs mb-6">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-20 text-center text-muted text-sm">No dashboard data available</div>
    );
  }

  const isLowBalance = (stats?.sms_balance ?? 0) <= 50;

  return (
    <motion.div
      className="space-y-8 font-sans text-ink"
      initial={{ opacity: 0, y: shouldReduce ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <Card className="p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[linear-gradient(135deg,#fff_0%,#ffe8d0_100%)]">
        <div className="relative z-10">
          <span className="px-2.5 py-1 rounded-full bg-white/80 text-primary text-[11px] font-semibold border border-line">
            Pay as you go
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink mt-3">
            Welcome back, {stats?.organization}
          </h1>
          <p className="text-sm text-muted mt-1 max-w-xl">
            Send SMS, host voice spaces, and run surveys from one place. Credits sit in your prepaid wallet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => onNavigate('broadcasts')}>
            <Send className="w-4 h-4" /> Send Broadcast
          </Button>
          <Button variant="outline" size="md" onClick={() => onNavigate('spaces')}>
            <Plus className="w-4 h-4" /> Add Space
          </Button>
        </div>
      </Card>

      {isLowBalance && (
        <div className="p-4 rounded-3xl bg-primary-soft border border-line text-alert text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-alert shrink-0" />
            <div>
              <p className="font-bold">SMS Credit Balance Low ({stats?.sms_balance} credits remaining)</p>
              <p className="text-[11px] text-muted">Top up your prepaid wallet to ensure broadcast SMS messages deliver uninterrupted.</p>
            </div>
          </div>
          <Button variant="alert" size="sm" onClick={() => onNavigate('billing')}>
            Top Up Wallet
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Spaces</span>
            <div className="p-2 rounded-2xl bg-primary-soft text-primary">
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

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Members</span>
            <div className="p-2 rounded-2xl bg-primary-soft text-primary">
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

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">SMS wallet</span>
            <div className="p-2 rounded-2xl bg-primary-soft text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-primary mt-3">
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

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Broadcasts this month</span>
            <div className="p-2 rounded-2xl bg-primary-soft text-primary">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 space-y-3">
          <h3 className="font-display font-bold text-ink text-base mb-1">Do this next</h3>

          <button type="button" onClick={() => onNavigate('broadcasts')} className="w-full text-left p-3.5 rounded-2xl border border-line bg-paper hover:border-primary hover:bg-primary-soft/50 transition flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-card text-primary">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Send a broadcast</p>
                <p className="text-xs text-muted">SMS every member in a space</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </button>

          <button type="button" onClick={() => onNavigate('spaces')} className="w-full text-left p-3.5 rounded-2xl border border-line bg-paper hover:border-primary hover:bg-primary-soft/50 transition flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-card text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Import members</p>
                <p className="text-xs text-muted">CSV / Excel into a space</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </button>

          <button type="button" onClick={() => onNavigate('surveys')} className="w-full text-left p-3.5 rounded-2xl border border-line bg-paper hover:border-primary hover:bg-primary-soft/50 transition flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-card text-primary">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Create a USSD survey</p>
                <p className="text-xs text-muted">Collect answers without data</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </button>
        </Card>

        <Card className="p-6 lg:col-span-2 space-y-4">
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
              {(Array.isArray(stats?.recent_broadcasts) ? stats.recent_broadcasts : []).map((b: {
                id?: number | string;
                space_name?: string;
                status?: string;
                message?: string;
                created_at?: string;
                recipients_count?: number;
                cost_credits?: number;
              }) => (
                <div key={b.id ?? `${b.space_name ?? 'broadcast'}-${b.created_at ?? Date.now()}`} className="p-4 rounded-2xl bg-paper border border-line flex items-start justify-between gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{b.space_name ?? 'Broadcast'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border border-line ${
                        b.status === 'sent' ? 'bg-paper text-success' : 'bg-paper text-muted'
                      }`}>
                        {b.status ?? 'queued'}
                      </span>
                    </div>
                    <p className="text-ink line-clamp-2">{b.message ?? ''}</p>
                    <p className="text-[10px] text-muted font-mono">{b.created_at ? new Date(b.created_at).toLocaleString() : 'Recently'}</p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <p className="font-bold text-primary">{b.recipients_count ?? 0} SMS</p>
                    <p className="text-[10px] text-muted">{b.cost_credits ?? 0} Credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};
