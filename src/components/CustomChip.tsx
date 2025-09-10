import React from "react";
import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";

interface CustomChipProps extends Omit<ChipProps, "sx"> {
  sx?: ChipProps["sx"];
}

export const CustomChip: React.FC<CustomChipProps> = ({ sx, ...props }) => {
  return (
    <Chip
      {...props}
      sx={{
        fontFamily: "var(--font-family-sans)",
        "& .MuiChip-label": {
          fontFamily: "var(--font-family-sans)",
        },
        ...sx,
      }}
    />
  );
};
