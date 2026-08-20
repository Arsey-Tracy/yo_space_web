import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { User, Organization } from '../types';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    organization_name: string;
    phone?: string;
    default_language?: string;
    trigger_test_payment?: boolean;
  }) => Promise<any>;
  logout: () => void;
  refreshOrg: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfileAndOrg = async () => {
    try {
      const userRes = await apiClient.get<User>('/auth/profile/');
      setUser(userRes.data);

      const orgRes = await apiClient.get<Organization>('/auth/organization/');
      setOrganization(orgRes.data);
    } catch (err) {
      setUser(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      fetchProfileAndOrg();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      // ensure local cleanup
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
      setOrganization(null);
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const login = async (username: string, password: string) => {
    const normalized = username.trim();
    const payload = {
      identifier: normalized,
      password,
    };

    try {
      const res = await apiClient.post('/auth/login/', payload);
      const access = res.data.tokens?.access || res.data.access;
      const refresh = res.data.tokens?.refresh || res.data.refresh;

      if (access) localStorage.setItem('access', access);
      if (refresh) localStorage.setItem('refresh', refresh);
      if (access) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      }

      await fetchProfileAndOrg();
    } catch (err: any) {
      const detail = err?.response?.data;
      let message = 'Login failed';

      if (typeof detail === 'string') message = detail;
      else if (detail?.detail) message = detail.detail;
      else if (detail?.non_field_errors?.[0]) message = detail.non_field_errors[0];
      else if (detail?.error) message = detail.error;
      else if (err?.message) message = err.message;

      throw new Error(message);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    organization_name: string;
    phone?: string;
    default_language?: string;
    trigger_test_payment?: boolean;
  }) => {
    const res = await apiClient.post('/auth/register/', data);
    const access = res.data.tokens?.access;
    const refresh = res.data.tokens?.refresh;
    if (access) localStorage.setItem('access', access);
    if (refresh) localStorage.setItem('refresh', refresh);
    setUser(res.data.user);
    setOrganization(res.data.organization);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setOrganization(null);
    try { delete apiClient.defaults.headers.common['Authorization']; } catch {}
  };

  const refreshOrg = async () => {
    try {
      const orgRes = await apiClient.get<Organization>('/auth/organization/');
      setOrganization(orgRes.data);
    } catch (err) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
