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

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${API_BASE}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem('access_token', newAccessToken);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(error.config);
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);
