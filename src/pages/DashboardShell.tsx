import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import { BarChart3, Users, MessageSquare, CreditCard } from 'lucide-react';

export const DashboardShell: React.FC = () => {
  const { data, loading, error } = useDashboard();

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-alert">Error loading dashboard: {error.message}</div>;

  const stats = data || {
    total_members: 0,
    sms_balance: 0,
    broadcasts_sent_this_month: 0,
    total_spaces: 0,
    recent_broadcasts: [],
  };

  const statItems = [
    { id: 'members', label: 'Members', value: stats.total_members, icon: Users },
    { id: 'sms', label: 'SMS Balance', value: stats.sms_balance, icon: CreditCard },
    { id: 'broadcasts', label: 'Broadcasts Sent', value: stats.broadcasts_sent_this_month, icon: MessageSquare },
    { id: 'spaces', label: 'Spaces', value: stats.total_spaces, icon: BarChart3 },
  ];

  const activityItems = (stats.recent_broadcasts || []).map((item: any) => ({
    id: item.id ?? `${item.space_name ?? 'broadcast'}-${item.created_at ?? Date.now()}`,
    message: `${item.space_name ?? 'Space'}: ${item.message ?? 'Broadcast sent'}`,
    timestamp: item.created_at ?? new Date().toISOString(),
  }));

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <StatCard
          key={item.id}
          title={item.label}
          value={item.value}
          Icon={item.icon}
          id={`dashboard-stat-${item.id}`}
        />
      ))}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <ActivityFeed activities={activityItems} />
      </div>
    </div>
  );
};

export default DashboardShell;
