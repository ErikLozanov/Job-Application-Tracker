import apiClient from './axios';
import { type JobStats } from '../types';

export const getJobStats = async () => {
  const { data } = await apiClient.get<JobStats>('/jobs/stats');
  return data;
};