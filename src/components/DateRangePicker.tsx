import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { Dayjs } from "dayjs";
import "dayjs/locale/es";

interface DateRangePickerProps {
  value: [Dayjs | null, Dayjs | null];
  onChange: (startDate: Date, endDate: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#0D47A1",
    },
  },
  typography: {
    fontFamily: "var(--font-family-sans)",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "12px !important",
          fontFamily: "var(--font-family-sans)",
          fontSize: "14px",
          "& fieldset": {
            borderRadius: "12px !important",
          },
          "&:hover fieldset": {
            borderRadius: "12px !important",
          },
          "&.Mui-focused fieldset": {
            borderRadius: "12px !important",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-family-sans)",
          fontSize: "14px",
          "&.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.6) !important",
          },
        },
      },
    },
  },
});

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(value[0]);
  const [endDate, setEndDate] = useState<Dayjs | null>(value[1]);

  // Sync with external value changes
  React.useEffect(() => {
    setStartDate(value[0]);
    setEndDate(value[1]);
  }, [value]);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (newValue && endDate && newValue.isAfter(endDate)) {
      setEndDate(null);
    }
    // If both dates are selected, trigger onChange
    if (newValue && endDate && !newValue.isAfter(endDate)) {
      onChange(newValue.toDate(), endDate.toDate());
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
    if (newValue && startDate) {
      onChange(startDate.toDate(), newValue.toDate());
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Box className={`flex items-center gap-2 ${className}`}>
          <DatePicker
            label="Fecha inicio"
            value={startDate}
            onChange={handleStartDateChange}
            disabled={disabled}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                placeholder: "DD/MM/YYYY",
                sx: {
                  maxWidth: "170px",
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    padding: "8px 12px",
                  },
                  "& .MuiPickersInputBase-root": {
                    borderRadius: "12px",
                  },
                },
              },
            }}
          />
          <span className="text-gray-500 font-sans">-</span>
          <DatePicker
            label="Fecha fin"
            value={endDate}
            onChange={handleEndDateChange}
            disabled={disabled || !startDate}
            minDate={startDate || undefined}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                placeholder: "DD/MM/YYYY",
                sx: {
                  maxWidth: "170px",
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    padding: "8px 12px",
                  },
                  "& .MuiPickersInputBase-root": {
                    borderRadius: "12px",
                  },
                },
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
