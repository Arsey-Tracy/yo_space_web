import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await apiClient.get('/api/members/');
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/members/', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
  });
}
