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
      onFiltersChangeRef.current(localFilters);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [localFilters]);

  const handleClearFilters = () => {
    const currentShift = filters.shift;
    setFilters(currentShift ? { shift: currentShift } : {});
    setLocalFilters({});
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between flex-row gap-4">
      <div className="flex items-center gap-4 flex-grow">
        <CustomTextField
          label="Buscar por ID, DNI, Cliente"
          placeholder="Ej: 123, 12345678, Juan Pérez"
          value={localFilters.search || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          disabled={isLoading}
          size="small"
          sx={{ minWidth: "100px", flex: 1 }}
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
