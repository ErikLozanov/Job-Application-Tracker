import apiClient from "./axios";
import type { Job, JobStats } from "../types";

export interface CreateJobData {
    company: string;
    jobTitle: string;
    status: string;
    priority: string;
    jobUrl?: string;
    appliedDate?: string;
    notes?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export interface JobFilters {
    limit?: number;
    search?: string;
    status?: string;
}

export const getAllJobs = async (params?: JobFilters) => {
    const query = new URLSearchParams();

    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);

    const { data } = await apiClient.get<Job[]>(`/jobs?${query.toString()}`);
    return data;
};

export const getJob = async (id: string) => {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`);
    return data;
};

export const getJobStats = async () => {
    const { data } = await apiClient.get<JobStats>("/jobs/stats");
    return data;
};

export const createJob = async (jobData: FormData) => {
  const { data } = await apiClient.post<Job>('/jobs', jobData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateJob = async (id: string, jobData: UpdateJobData) => {
    const { data } = await apiClient.put<Job>(`/jobs/${id}`, jobData);
    return data;
};

export const deleteJob = async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/jobs/${id}`);
    return data;
};

export const generateCoverLetter = async (jobId: string) => {
  const { data } = await apiClient.post<{ coverLetter: string }>('/ai/cover-letter', { jobId });
  return data;
};
