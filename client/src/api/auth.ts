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
