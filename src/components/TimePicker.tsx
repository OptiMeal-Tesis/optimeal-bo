import React from "react";
import { Select, MenuItem, FormControl } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface TimePickerProps {
  value: string;
  onChange: (timeSlot: string) => void;
  disabled?: boolean;
  size?: "small" | "medium";
}

const timeSlots = [
  { value: "11-12", label: "11:00 - 12:00" },
  { value: "12-13", label: "12:00 - 13:00" },
  { value: "13-14", label: "13:00 - 14:00" },
  { value: "14-15", label: "14:00 - 15:00" },
];

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  size = "medium",
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size={size} disabled={disabled} sx={{ minWidth: "150px" }}>
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
        <MenuItem
          value=""
          sx={{ fontFamily: "var(--font-family-sans)", fontSize: "14px" }}
        >
          Todos
        </MenuItem>
        {timeSlots.map((slot) => (
          <MenuItem
            key={slot.value}
            value={slot.value}
            sx={{
              fontFamily: "var(--font-family-sans)",
              fontSize: "14px",
            }}
          >
            {slot.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
