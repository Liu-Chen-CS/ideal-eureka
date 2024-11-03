import React from "react";
import { useField, useFormikContext } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SxProps, Theme } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import deLocale from "date-fns/locale/de";

interface MaterialUiDatePickerWrapperProps {
  name: string;
  label?: string;
  disabled?: boolean;
  inputSx?: SxProps<Theme>;
  className?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
}

const MaterialUiDatePickerWrapper: React.FC<
  MaterialUiDatePickerWrapperProps
> = ({
  name,
  label,
  disabled = false,
  inputSx,
  className,
  minDate,
  maxDate,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (value: Date | null) => {
    setFieldValue(name, value);
  };

  const customStyles = {
    "& .MuiOutlinedInput-root": {
      fontSize: "18px",
      height: "48px",
      fontFamily: "EONBrixSans, Arial, Geneva, Helvetica, sans-serif",
      borderRadius: "8px",
      background: disabled ? "#f0f0f0" : "#ffffff",
      color: "#262626",
      cursor: disabled ? "not-allowed" : "default",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#cccbca",
        borderWidth: "3px",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: disabled ? "#cccbca" : "#1ea2b1",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1ea2b1",
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "#b00402",
      },
    },
    "& .MuiOutlinedInput-input.Mui-disabled": {
      cursor: "not-allowed",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={deLocale}>
      <DatePicker
        label={label}
        value={field.value || null}
        onChange={handleChange}
        disabled={disabled}
        minDate={minDate ? new Date(minDate) : undefined}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        format="dd.MM.yyyy"
        slotProps={{
          textField: {
            fullWidth: true,
            error: meta.touched && Boolean(meta.error),
            helperText: meta.touched && meta.error ? meta.error : null,
            className: className,
            sx: { ...customStyles, ...inputSx },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default MaterialUiDatePickerWrapper;
