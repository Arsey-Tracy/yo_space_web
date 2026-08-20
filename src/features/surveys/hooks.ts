import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export function useSurveys() {
  return useQuery({
    queryKey: ['surveys'],
    queryFn: async () => (await apiClient.get('/api/surveys/')).data,
    staleTime: 1000 * 60,
  });
}

export function useCreateSurvey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/surveys/', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surveys'] }),
  });
}

export function useSurveyResults(surveyId: number) {
  return useQuery({
    queryKey: ['survey', surveyId, 'results'],
    queryFn: async () => (await apiClient.get(`/api/surveys/${surveyId}/results/`)).data,
  });
}
