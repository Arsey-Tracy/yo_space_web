// src/api/dashboard.ts
import { apiClient } from './client';
import type { Broadcast, WalletTransaction } from '../types';

export interface DashboardStats {
  organization: string;
  total_members: number;
  sms_balance: number;
  cash_balance_ugx?: number;
  broadcasts_sent_this_month: number;
  total_spaces: number;
  recent_broadcasts: Broadcast[];
  recent_transactions?: WalletTransaction[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats/');
  return response.data;
};
