import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface RadioOption {
  value: string;
  label: string;
}

interface CustomRadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  row?: boolean;
}

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  label,
  value,
  onChange,
  options,
  error = false,
  required = false,
  disabled = false,
  row = true,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex items-center gap-4">
      <FormLabel
        component="legend"
        sx={{
          fontFamily: "var(--font-family-sans)",
          color: "var(--color-gray-700)",
          margin: 0,
          minWidth: "fit-content",
        }}
      >
        {label}
      </FormLabel>
      <FormControl
        component="fieldset"
        error={error}
        required={required}
        disabled={disabled}
      >
        <RadioGroup row={row} value={value} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: "var(--color-gray-400)",
                    "&.Mui-checked": {
                      color: "var(--color-primary-500)",
                    },
                    "&:hover": {
                      backgroundColor:
                        "rgba(var(--color-primary-500-rgb), 0.04)",
                    },
                  }}
                />
              }
              label={option.label}
              sx={{
                fontFamily: "var(--font-family-sans)",
                "& .MuiFormControlLabel-label": {
                  fontFamily: "var(--font-family-sans)",
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};
