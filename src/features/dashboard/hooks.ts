import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/dashboard/stats/');
        return response.data || response;
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 1000 * 30,
    retry: 1,
    throwOnError: false,
  });
}
