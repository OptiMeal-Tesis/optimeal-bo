import { useBasicQuery, request } from "./useApi";
import type { ShiftSummaryResponse } from "../types/shift";

export const useGetShiftSummary = (shift?: string) => {
  return useBasicQuery({
    queryKey: ["shiftSummary", shift],
    f: async () => {
      const params: Record<string, string> = {};
      if (shift && shift !== "all") {
        params.shift = shift;
      }

      const response = await request<ShiftSummaryResponse>(
        "GET",
        "/orders/shift/summary",
        params
      );
      return response;
    },
  });
};
