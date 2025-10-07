import { useBasicQuery } from './useApi';
import { request } from './useApi';

interface ShiftsResponse {
  success: boolean;
  message: string;
  data: string[];
}

export const useShifts = () => {
  return useBasicQuery<ShiftsResponse>({
    queryKey: ['shifts'],
    f: () => request<ShiftsResponse>('GET', '/orders/shifts'),
    enabled: true,
  });
};
