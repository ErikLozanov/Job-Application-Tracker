import apiClient from './axios';
import type { User } from '../types';

export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const { data } = await apiClient.post<User>('/auth/register', userData);
  return data;
};

export const loginUser = async (userData: { email: string; password: string }) => {
  const { data } = await apiClient.post<User>('/auth/login', userData);
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', { token, newPassword });
  return data;
};
