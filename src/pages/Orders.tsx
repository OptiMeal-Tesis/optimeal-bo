import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  OrdersTable,
  OrderFilters,
  TimePicker,
  Pagination,
  ShiftSummary,
} from "../components";
import { useGetAllOrders } from "../hooks/useOrders";
import type { OrderFilters as OrderFiltersType } from "../types/orders";
import toast from "react-hot-toast";

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<OrderFiltersType>({
    page: 1,
    limit: 10,
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    searchParams.get("shift") || "all"
  );
  const { data: ordersResponse, isLoading, error } = useGetAllOrders(filters, { enableRealtime: true });
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

  // Apply initial filter when component mounts with URL shift parameter
  useEffect(() => {
    if (
      selectedTimeSlot &&
      selectedTimeSlot !== "" &&
      selectedTimeSlot !== "todos" &&
      selectedTimeSlot !== "all"
    ) {
      setFilters((prev) => ({
        ...prev,
        shift: selectedTimeSlot,
        page: 1,
      }));
    } else if (selectedTimeSlot === "all") {
      setFilters((prev) => {
        const { shift, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    }
  }, [selectedTimeSlot]);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: OrderFiltersType) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleTimeSlotChange = useCallback(
    (timeSlot: string) => {
      setSelectedTimeSlot(timeSlot);

      // Update URL parameters
      const newSearchParams = new URLSearchParams(searchParams);
      if (timeSlot === "" || timeSlot === "todos" || timeSlot === "all") {
        newSearchParams.delete("shift");
      } else {
        newSearchParams.set("shift", timeSlot);
      }
      setSearchParams(newSearchParams);

      if (timeSlot === "todos" || timeSlot === "" || timeSlot === "all") {
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
    },
    [searchParams, setSearchParams]
  );

  // Map TimePicker values to shift values for the summary
  const getShiftForSummary = (timeSlot: string) => {
    if (timeSlot === "" || timeSlot === "todos" || timeSlot === "all") {
      return "all";
    }
    return timeSlot;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-gray-100 py-2">
        <span className="text-h2-bold text-primary-500">
          Pedidos - {formattedDate}
        </span>

        <div className="flex items-center gap-4">
          <TimePicker
            value={selectedTimeSlot}
            onChange={handleTimeSlotChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Shift Summary Cards */}
      <ShiftSummary selectedShift={getShiftForSummary(selectedTimeSlot)} />


      <div className="flex flex-col gap-2 mt-4">
        <span className="text-sub1 text-primary-500">Pedidos</span>
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
    </div>
  );
};
