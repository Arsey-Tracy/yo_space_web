// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../api/dashboard';
import type { DashboardStats } from '../api/dashboard';

interface UseDashboardResult {
  data: DashboardStats | null;
  loading: boolean;
  error: Error | null;
}

export const useDashboard = (): UseDashboardResult => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    try {
      const stats = await fetchDashboardStats();
      setData(stats);
      setError(null);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000); // poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};
