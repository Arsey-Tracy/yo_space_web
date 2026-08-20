export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL || '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch (e) { /* ignore */ }
    const message = body?.detail || body?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, data: any): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data) });
}
