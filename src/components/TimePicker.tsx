import React from "react";
import { Select, MenuItem, FormControl } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useShifts } from "../hooks/useShifts";

interface TimePickerProps {
  value: string;
  onChange: (timeSlot: string) => void;
  disabled?: boolean;
  size?: "small" | "medium";
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  size = "medium",
}) => {
  const { data: shiftsResponse, isLoading } = useShifts();
  const shifts = shiftsResponse?.data || [];

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  // Format shift for display
  const formatShiftLabel = (shift: string) => {
    if (shift === "all") {
      return "Todos";
    }
    // Convert "11-11:30" to "11:00 - 11:30"
    return shift.replace("-", " - ");
  };

  return (
    <FormControl size={size} disabled={disabled || isLoading} sx={{ minWidth: "150px" }}>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        sx={{
          fontFamily: "var(--font-family-sans)",
          borderRadius: "12px",
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
        {shifts.map((shift) => (
          <MenuItem
            key={shift}
            value={shift}
            sx={{
              fontFamily: "var(--font-family-sans)",
              fontSize: "14px",
            }}
          >
            {formatShiftLabel(shift)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
