import { useBasicQuery, request } from "./useApi";
import type { StatsResponse, StatsFilters } from "../types/stats";

export const useGetStats = (filters?: StatsFilters) => {
  return useBasicQuery({
    queryKey: ["stats", filters],
    f: async () => {
      const params: any = {};

      if (filters?.startDate) {
        params.start_date = filters.startDate;
      }
      if (filters?.endDate) {
        params.end_date = filters.endDate;
      }

      const response = await request<StatsResponse>("GET", "/stats", params);
      return response;
    },
  });
};
