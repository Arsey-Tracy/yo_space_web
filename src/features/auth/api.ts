import { apiPost } from '../../lib/api-client';

export interface LoginPayload { identifier: string; password: string }

export async function login(payload: LoginPayload) {
  return apiPost('/auth/login/', payload);
}

export async function register(payload: any) {
  return apiPost('/auth/register/', payload);
}
