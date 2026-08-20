// src/components/StatCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, id }) => {
  return (
    <motion.div
      className="glass-card p-4 flex flex-col items-start justify-center space-y-2 hover:shadow-lg transition-shadow"
      id={id}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className="w-6 h-6 text-primary" />
      <div className="text-sm font-medium text-muted">{title}</div>
      <div className="text-2xl font-display font-bold text-ink">{value.toLocaleString()}</div>
    </motion.div>
  );
};

export default StatCard;
