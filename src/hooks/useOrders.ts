import { request, useBasicQuery, useBasicMutation } from "./useApi";
import type { OrdersResponse, OrderFilters } from "../types/orders";
import type { OrderStatus } from "../types/orders";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
}

export const useGetAllOrders = (
  filters?: OrderFilters,
  options?: {
    enableRealtime?: boolean;
  }
) => {
  const enableRealtime = options?.enableRealtime ?? true;
  const queryClient = useQueryClient();

  const query = useBasicQuery({
    queryKey: ["orders", filters],
    f: async () => {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.status) {
        params.append("status", filters.status);
      }
      if (filters?.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters?.endDate) {
        params.append("endDate", filters.endDate);
      }
      if (filters?.shift) {
        params.append("shift", filters.shift);
      }
      if (filters?.page) {
        params.append("page", filters.page.toString());
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `/orders?${queryString}` : "/orders";

      const response = await request<OrdersResponse>("GET", url);
      return response;
    },
  });
  
  useEffect(() => {
    if (!enableRealtime) return;

    const channel = supabase
      .channel("orders-realtime")
      .on("broadcast", { event: "new-order" }, (payload) => {
        const data: any = payload.payload;
        toast.success(`Nueva orden #${data?.order?.id ?? ""}`);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });
      })
      .on("broadcast", { event: "order-status-updated" }, () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });
      })
      .on("broadcast", { event: "shift-summary-updated" }, () => {
        queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime, queryClient]);

  return query;
};

export const useUpdateOrderStatus = () => {
  return useBasicMutation<
    UpdateOrderStatusResponse,
    { orderId: number; status: OrderStatus }
  >({
    f: async ({ orderId, status }) => {
      const response = await request<UpdateOrderStatusResponse>(
        "PUT",
        `/orders/${orderId}/status`,
        { status }
      );
      return response;
    },
  });
};
