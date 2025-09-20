import { TextField, InputAdornment } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

export interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  prefix?: string;
}

const CustomTextField = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  ({ sx, error, prefix, InputProps, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        error={error}
        InputProps={{
          ...InputProps,
          ...(prefix && props.value
            ? {
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      fontFamily: "Futura, sans-serif !important",
                      color: "black !important",
                      fontWeight: "500 !important",
                      "& .MuiInputAdornment-root": {
                        fontFamily: "Futura, sans-serif !important",
                        color: "black !important",
                      },
                      "& *": {
                        fontFamily: "Futura, sans-serif !important",
                        color: "black !important",
                      },
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Futura, sans-serif",
                        color: "black",
                        fontWeight: "500",
                      }}
                    >
                      {prefix}
                    </span>
                  </InputAdornment>
                ),
              }
            : {}),
        }}
        sx={{
          fontFamily: 'var(--font-family-sans)',
          '& .MuiInputBase-root': {
            fontFamily: 'var(--font-family-sans)',
            backgroundColor: 'transparent',
            borderRadius: '12px',
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'var(--font-family-sans)',
            color: 'var(--color-gray-500)',
            '&.Mui-focused': {
              color: 'var(--color-primary-500)',
            },
            '&.Mui-error': {
              color: 'var(--color-error)',
            },
          },
          '& .MuiFormHelperText-root': {
            fontFamily: 'var(--font-family-sans)',
            '&.Mui-error': {
              color: 'var(--color-error)',
            },
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-primary-500)',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-error)',
            },
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

CustomTextField.displayName = "CustomTextField";

export default CustomTextField;
