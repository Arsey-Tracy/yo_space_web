import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: async () => (await apiClient.get('/api/spaces/')).data,
    staleTime: 1000 * 60,
  });
}

export function useCreateSpace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/spaces/', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spaces'] }),
  });
}

export function useSpaceDetails(spaceId: number) {
  return useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => (await apiClient.get(`/api/spaces/${spaceId}/`)).data,
  });
}
