import { TextField, MenuItem, Box } from "@mui/material";
import type { TextFieldProps, SelectProps } from "@mui/material";
import { forwardRef } from "react";
import { CustomChip } from "./CustomChip";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface CustomSelectFieldProps
  extends Omit<TextFieldProps, "variant" | "SelectProps"> {
  variant?: "outlined" | "filled" | "standard";
  options: SelectOption[] | string[];
  placeholder?: string;
  SelectProps?: SelectProps;
  showChips?: boolean;
}

const CustomSelectField = forwardRef<HTMLDivElement, CustomSelectFieldProps>(
  (
    {
      sx,
      error,
      options,
      placeholder,
      SelectProps,
      onChange,
      showChips = true,
      ...props
    },
    ref
  ) => {
    // Convert string array to SelectOption array if needed
    const normalizedOptions: SelectOption[] = options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
    );

    const handleChange = (event: any) => {
      if (onChange) {
        const value = event.target.value;
        onChange(value);
      }
    };

    // Function to render selected values as chips
    const renderValue = (selected: any) => {
      if (!showChips || !Array.isArray(selected) || selected.length === 0) {
        return selected;
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            maxHeight: "100px",
            overflow: "auto",
            position: "relative",
            zIndex: 1,
            "& .MuiChip-root": {
              position: "relative",
              zIndex: 2,
            },
          }}
        >
          {selected.map((value) => {
            const option = normalizedOptions.find((opt) => opt.value === value);
            const label = option ? option.label : value;

            return <CustomChip key={value} label={label} size="small" />;
          })}
        </Box>
      );
    };

    return (
      <TextField
        ref={ref}
        variant="outlined"
        select
        SelectProps={{
          ...SelectProps,
          renderValue: showChips ? renderValue : undefined,
        }}
        error={error}
        onChange={handleChange}
        fullWidth
        sx={{
          fontFamily: "var(--font-family-sans)",
          "& .MuiInputBase-root": {
            fontFamily: "var(--font-family-sans)",
            backgroundColor: "transparent",
          },
          "& .MuiInputLabel-root": {
            fontFamily: "var(--font-family-sans)",
            color: "var(--color-gray-500)",
            "&.Mui-focused": {
              color: "var(--color-primary-500)",
            },
            "&.Mui-error": {
              color: "var(--color-error)",
            },
          },
          "& .MuiFormHelperText-root": {
            fontFamily: "var(--font-family-sans)",
            "&.Mui-error": {
              color: "var(--color-error)",
            },
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-primary-500)",
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-error)",
            },
          },
          "& .MuiSelect-select": {
            fontFamily: "var(--font-family-sans)",
            "&:focus": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiMenuItem-root": {
            fontFamily: "var(--font-family-sans)",
            "& .MuiListItemText-root": {
              fontFamily: "var(--font-family-sans)",
            },
          },
          "& .MuiSelect-icon": {
            fontFamily: "var(--font-family-sans)",
          },
          ...sx,
        }}
        {...props}
      >
        {placeholder && (
          <MenuItem
            value=""
            disabled
            sx={{ fontFamily: "var(--font-family-sans)" }}
          >
            {placeholder}
          </MenuItem>
        )}
        {normalizedOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ fontFamily: "var(--font-family-sans)" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

CustomSelectField.displayName = "CustomSelectField";

export default CustomSelectField;
