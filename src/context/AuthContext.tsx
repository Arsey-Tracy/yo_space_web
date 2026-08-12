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
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfileAndOrg();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Normalize the identifier (trim + lowercase) before sending so that
    // email/username casing differences don't cause a 401.
    const normalized = username.trim().toLowerCase();
    const payload: Record<string, string> = { password };
    if (normalized.includes('@')) {
      payload.email = normalized;
    } else {
      payload.username = normalized;
    }
    try {
      const res = await apiClient.post('/auth/login/', payload);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      // Ensure the interceptor uses the new token immediately
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      await fetchProfileAndOrg();
    } catch (err: any) {
      // Throw a simplified error for UI consumption
      const message = err?.response?.data?.detail || err.message || 'Login failed';
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
    localStorage.setItem('access_token', res.data.tokens.access);
    localStorage.setItem('refresh_token', res.data.tokens.refresh);
    setUser(res.data.user);
    setOrganization(res.data.organization);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setOrganization(null);
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
