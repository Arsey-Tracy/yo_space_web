// src/components/ActivityFeed.tsx
import React from 'react';

interface Activity {
  id: string | number;
  message: string;
  timestamp: string; // ISO string
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <div className="p-4 text-muted">No recent activity.</div>;
  }

  return (
    <div className="glass-card p-4 overflow-y-auto max-h-64">
      <h2 className="text-lg font-display font-bold mb-2 text-ink">Recent Activity</h2>
      <ul className="space-y-2">
        {activities.map((act) => (
          <li key={act.id} className="flex items-start space-x-2">
            <span className="text-xs text-muted flex-shrink-0 w-20">{new Date(act.timestamp).toLocaleString()}</span>
            <span className="text-sm text-ink">{act.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
