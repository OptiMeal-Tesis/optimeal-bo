import { useState, useCallback } from "react";
import {
  OrdersTable,
  OrderFilters,
  TimePicker,
  Pagination,
} from "../components";
import { useGetAllOrders } from "../hooks/useOrders";
import type { OrderFilters as OrderFiltersType } from "../types/orders";
import toast from "react-hot-toast";

export const Orders = () => {
  const [filters, setFilters] = useState<OrderFiltersType>({
    page: 1,
    limit: 10,
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const { data: ordersResponse, isLoading, error } = useGetAllOrders(filters);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Show error toast if query fails
  if (error) {
    toast.error("No se pudieron obtener las órdenes", {
      duration: 4000,
      style: {
        background: "var(--color-white)",
        color: "var(--color-gray-600)",
      },
    });
  }

  const orders = ordersResponse?.data || [];
  const pagination = ordersResponse?.pagination;

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: OrderFiltersType) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleTimeSlotChange = useCallback((timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);

    if (timeSlot === "todos" || timeSlot === "") {
      setFilters((prev) => {
        const { shift, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        shift: timeSlot,
        page: 1,
      }));
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-h2-bold text-primary-500">
            Pedidos - {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <TimePicker
            value={selectedTimeSlot}
            onChange={handleTimeSlotChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* TODO: Cards de resumen de productos - Endpoint pendiente */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 italic">
          Cards de resumen de productos (endpoint pendiente)
        </p>
      </div>

      {/* Filters */}
      <OrderFilters
        onFiltersChange={handleFiltersChange}
        filters={filters}
        setFilters={setFilters}
        isLoading={isLoading}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        pagination={pagination}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
