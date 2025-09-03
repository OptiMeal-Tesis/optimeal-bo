import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export interface CustomButtonProps extends ButtonProps {}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ sx, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        sx={{
          fontFamily: 'var(--font-family-sans)',
          borderRadius: '12px',
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 500,
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: 'none',
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
