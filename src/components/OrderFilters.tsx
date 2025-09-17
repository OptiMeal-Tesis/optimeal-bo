import React, { useState, useEffect, useRef } from "react";
import CustomTextField from "./CustomTextField";
import CustomButton from "./CustomButton";
import type { OrderFilters as OrderFiltersType } from "../types/orders";

interface OrderFiltersProps {
  onFiltersChange: (filters: OrderFiltersType) => void;
  filters: OrderFiltersType;
  setFilters: (filters: OrderFiltersType) => void;
  isLoading?: boolean;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  onFiltersChange,
  filters,
  setFilters,
  isLoading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<OrderFiltersType>({});
  const onFiltersChangeRef = useRef(onFiltersChange);

  // Keep ref updated
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  // Debounce effect - wait 500ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters]);

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChangeRef.current(filters);
  }, []);

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between">
      <div className="flex items-center gap-4">
        <CustomTextField
          label="ID de Orden"
          placeholder="Ej: 123"
          value={localFilters.orderId || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, orderId: e.target.value }))
          }
          disabled={isLoading}
          size="small"
          sx={{ minWidth: "150px" }}
        />

        <CustomTextField
          label="DNI del Cliente"
          placeholder="Ej: 12345678"
          value={localFilters.nationalId || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              nationalId: e.target.value,
            }))
          }
          disabled={isLoading}
          size="small"
          sx={{ minWidth: "150px" }}
        />

        <CustomTextField
          label="Nombre del Cliente"
          placeholder="Ej: Juan Pérez"
          value={localFilters.userName || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, userName: e.target.value }))
          }
          disabled={isLoading}
          size="small"
          sx={{ minWidth: "150px" }}
        />
      </div>

      <CustomButton
        onClick={handleClearFilters}
        disabled={isLoading}
        sx={{
          backgroundColor: "var(--color-gray-500)",
          color: "var(--color-white)",
          padding: "8px 16px",
          fontSize: "14px",
          "&:hover": {
            backgroundColor: "var(--color-gray-600)",
          },
        }}
      >
        Limpiar
      </CustomButton>
    </div>
  );
};
