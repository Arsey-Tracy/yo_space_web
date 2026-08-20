import { post, setAuthToken } from './client';

export const registerUser = (data: {
  orginazation_name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  default_language?: string;
}) => {
  return post('/auth/register/', data, { skipAuth: true, includeCredentials: false });
};

export const login = (data: { email: string; password: string }) => {
  return post('/auth/login/', data, { skipAuth: true, includeCredentials: false });
};

export const logout = () => {
  setAuthToken(null);
  return Promise.resolve();
};