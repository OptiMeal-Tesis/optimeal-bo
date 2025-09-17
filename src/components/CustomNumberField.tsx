import { TextField } from "@mui/material";

interface CustomNumberFieldProps {
  value: number;
  label: string;
  min?: number;
  onChange?: (value: number) => void;
}

export const CustomNumberField = ({
  value,
  label,
  min = 0,
  onChange,
}: CustomNumberFieldProps) => {
  return (
    <TextField
      type="number"
      value={value}
      size="small"
      label={label}
      variant="outlined"
      inputProps={{
        min,
        style: {
          width: "64px",
          textAlign: "left",
          fontSize: "14px",
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "44px",
          borderRadius: "12px",
          "& fieldset": {
            borderColor: "#d1d5db",
          },
          "&:hover fieldset": {
            borderColor: "var(--color-primary-500)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--color-primary-500)",
          },
        },
        "& .MuiInputLabel-root": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-body1)",
          color: "var(--color-primary-500)",
          "&.Mui-focused": {
            color: "var(--color-primary-500)",
          },
        },
        "& .MuiOutlinedInput-input": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-body1)",
          lineHeight: "var(--line-height-body1)",
          color: "var(--color-black)",
        },
      }}
      onChange={(e) => {
        const newValue = parseInt(e.target.value) || 0;
        onChange?.(newValue);
      }}
    />
  );
};
