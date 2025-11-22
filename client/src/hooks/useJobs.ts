import { useQuery } from '@tanstack/react-query';
import { getJobStats } from '../api/jobs';

export const useJobStats = () => {
  return useQuery({
    queryKey: ['jobStats'],
    queryFn: getJobStats,
  });
};