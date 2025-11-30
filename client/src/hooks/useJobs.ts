import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getJobStats,
    createJob,
    // type CreateJobData,
    getAllJobs,
    getJob,
    updateJob,
    // type UpdateJobData,
    deleteJob,
    type JobFilters,
    generateCoverLetter,
    generateInterviewQuestions,
} from "../api/jobs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useJobStats = () => {
    return useQuery({
        queryKey: ["jobStats"],
        queryFn: getJobStats,
    });
};

export const useCreateJob = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: any) => createJob(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobStats"] });

            navigate("/");
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Create Job Error:",
                    error.response?.data?.message || error.message
                );
            }
        },
    });
};

export const useJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters], 
    queryFn: () => getAllJobs(filters),
  });
};

export const useJob = (id: string) => {
    return useQuery({
        queryKey: ["job", id],
        queryFn: () => getJob(id),
        enabled: !!id,
    });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateJob(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['job', data.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobStats'] });
    },
  });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["jobStats"] });

            navigate("/jobs");
        },
    });
};

export const useGenerateCoverLetter = () => {
  return useMutation({
    mutationFn: (jobId: string) => generateCoverLetter(jobId),
    onError: (error) => {
      console.error("AI Error:", error);
      alert("Failed to generate cover letter. Check your console.");
    }
  });
};

export const useGenerateInterviewQuestions = () => {
  return useMutation({
    mutationFn: (jobId: string) => generateInterviewQuestions(jobId),
    onError: (error) => {
      console.error("AI Error:", error);
      alert("Failed to generate interview prep.");
    }
  });
};
