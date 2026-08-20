import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000';
  }
  return 'https://yo-space-2g.onrender.com';
};

const API_BASE = getBaseUrl();

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function get<T = any>(url: string, config?: any): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T = any>(url: string, data?: any, config?: any): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem('access', token);
    else {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  } catch {}
}
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Token Refresh
// Response Interceptor: Handle Unauthorized / Token Refresh with queueing
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) {
        // nothing to do
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .post(`${API_BASE}/auth/token/refresh/`, { refresh: refreshToken })
          .then((res) => {
            const newAccess = res.data?.access;
            if (newAccess) {
              localStorage.setItem('access', newAccess);
              apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
            }
            return newAccess || null;
          })
          .catch(() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            // notify app that authentication is no longer valid
            try {
              window.dispatchEvent(new Event('auth:logout'));
            } catch {}
            return null;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newAccess = await refreshPromise;
      if (newAccess) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
