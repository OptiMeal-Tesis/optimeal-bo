import { request, useBasicQuery, useBasicMutation } from "./useApi";
import type { OrdersResponse, OrderFilters } from "../types/orders";
import type { OrderStatus } from "../types/orders";

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
}

export const useGetAllOrders = (filters?: OrderFilters) => {
  return useBasicQuery({
    queryKey: ["orders", filters],
    f: async () => {
      const params = new URLSearchParams();

      if (filters?.orderId) {
        params.append("orderId", filters.orderId);
      }
      if (filters?.nationalId) {
        params.append("nationalId", filters.nationalId);
      }
      if (filters?.userName) {
        params.append("userName", filters.userName);
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
