import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

const CustomTextField = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  ({ sx, error, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        error={error}
        sx={{
          fontFamily: 'var(--font-family-sans)',
          '& .MuiInputBase-root': {
            fontFamily: 'var(--font-family-sans)',
            backgroundColor: 'transparent',
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

CustomTextField.displayName = 'CustomTextField';

export default CustomTextField;
