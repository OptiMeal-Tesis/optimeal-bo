import React from "react";
import { Select, MenuItem, FormControl } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { OrderStatus } from "../types/orders";

interface OrderStatusSelectProps {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
  size?: "small" | "medium";
}

const statusOptions = [
  { value: "PENDING" as OrderStatus, label: "Pendiente" },
  { value: "PREPARING" as OrderStatus, label: "Preparando" },
  { value: "READY" as OrderStatus, label: "Listo" },
  { value: "DELIVERED" as OrderStatus, label: "Entregado" },
  { value: "CANCELLED" as OrderStatus, label: "Cancelado" },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "text-gray-600";
    case "PREPARING":
      return "text-yellow-500";
    case "READY":
      return "text-success";
    case "DELIVERED":
      return "text-primary-500";
    case "CANCELLED":
      return "text-error";
    default:
      return "text-gray-800";
  }
};

export const OrderStatusSelect: React.FC<OrderStatusSelectProps> = ({
  value,
  onChange,
  disabled = false,
  size = "small",
}) => {
  const handleChange = (event: SelectChangeEvent<OrderStatus>) => {
    onChange(event.target.value as OrderStatus);
  };

  return (
    <FormControl size={size} disabled={disabled} fullWidth>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        sx={{
          fontFamily: "var(--font-family-sans)",
          fontSize: "14px",
          "& .MuiSelect-select": {
            fontFamily: "var(--font-family-sans)",
            padding: size === "small" ? "8px 12px" : "12px 16px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-gray-300)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary-500)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary-500)",
          },
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontFamily: "var(--font-family-sans)",
              fontSize: "14px",
            }}
          >
            <span className={getStatusColor(option.value)}>{option.label}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
