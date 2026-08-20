import { useMutation } from '@tanstack/react-query';
import * as api from './api';

export function useLogin() {
  return useMutation({
    mutationFn: (data: { identifier?: string; email?: string; username?: string; password: string }) =>
      api.login({
        identifier: data.identifier ?? data.email ?? data.username ?? '',
        password: data.password,
      }),
    onSuccess: (data) => {
      try {
        const access = (data as any).access || (data as any).tokens?.access || (data as any).token;
        const refresh = (data as any).refresh || (data as any).tokens?.refresh;
        if (access) localStorage.setItem('access', access);
        if (refresh) localStorage.setItem('refresh', refresh);
      } catch {}
    },
  });
}
