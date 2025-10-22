import React from "react";
import type { Order, OrderStatus, PaginationInfo } from "../types/orders";
import { useUpdateOrderStatus } from "../hooks/useOrders";
import toast from "react-hot-toast";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { useQueryClient } from "@tanstack/react-query";

interface OrdersTableProps {
  orders: Order[];
  pagination?: PaginationInfo;
  isLoading?: boolean;
  statsPage?: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
};

const getStatusInfo = (status: OrderStatus) => {
  const statusMap = {
    PENDING: { label: "Pendiente", className: "text-gray-600" },
    PREPARING: { label: "Preparando", className: "text-yellow-500" },
    READY: { label: "Listo", className: "text-success" },
    DELIVERED: { label: "Entregado", className: "text-primary-500" },
    CANCELLED: { label: "Cancelado", className: "text-error" },
  };

  return statusMap[status] || { label: status, className: "text-gray-800" };
};

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  pagination,
  isLoading,
  statsPage = false,
}) => {
  const updateStatusMutation = useUpdateOrderStatus();
  const queryClient = useQueryClient();

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: newStatus,
      });

      // Invalidate and refetch orders and shift summary data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });

      toast.success(`Orden #${orderId} actualizada correctamente a ${getStatusInfo(newStatus).label}.`, {
        duration: 3000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
    } catch (error) {
      toast.error("Error al actualizar el estado", {
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-gray-600)",
        },
      });
    }
  };
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-body1">
          {pagination
            ? `No se encontraron órdenes en la página ${pagination.page}`
            : "No se encontraron órdenes"}
        </p>
        {pagination && pagination.total > 0 && (
          <p className="text-gray-400 text-sm mt-2">
            Total de órdenes: {pagination.total}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora de Retiro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.user.name}</div>
                  <div className="text-xs text-gray-500">
                    DNI: {order.user.nationalId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(order.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.shift?.replace(/\s*-\s*/, ' - ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="max-w-xs">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="mb-1 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {item.product.name}
                          </span>
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                        {item.side && (
                          <div className="text-xs text-gray-500 ml-2">
                            + {item.side.name}
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-xs text-gray-400 ml-2 italic">
                            "{item.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statsPage ? (
                    <span
                      className={`font-medium ${
                        getStatusInfo(order.status).className
                      }`}
                    >
                      {getStatusInfo(order.status).label}
                    </span>
                  ) : (
                    <OrderStatusSelect
                      value={order.status}
                      onChange={(status) =>
                        handleStatusChange(order.id, status)
                      }
                      disabled={updateStatusMutation.isPending}
                      size="small"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
