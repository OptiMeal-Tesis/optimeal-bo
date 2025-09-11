import { CircularProgress } from "@mui/material";
import React from "react";

export interface LoaderProps {
  size?: number;
  thickness?: number;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 28,
  thickness = 4,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        sx={{ color: "var(--color-primary-500)" }}
      />
    </div>
  );
};

export default Loader;
