import React from "react";
import { useField, useFormikContext } from "formik";
import { TextField, MenuItem } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface MaterialUiSelectWrapperProps {
  name: string;
  label?: string;
  options: string[];
  readOnly?: boolean;
  disabled?: boolean;
  inputSx?: SxProps<Theme>;
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
  newOption?: string | undefined;
}

const MaterialUiSelectWrapper: React.FC<MaterialUiSelectWrapperProps> = ({
  name,
  label,
  options,
  readOnly = false,
  inputSx,
  placeholder,
  disabled = false,
  className,
  onSelect,
  newOption,
}) => {
  const { setFieldValue } = useFormikContext();

  const [field, meta] = useField(name);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;

    setFieldValue(name, value);

    if (onSelect) {
      onSelect(value);
    }
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
    <TextField
      select
      label={label}
      fullWidth
      variant="outlined"
      {...field}
      value={field.value || ""}
      onChange={handleChange}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error ? meta.error : null}
      disabled={disabled}
      InputProps={{
        readOnly: readOnly,
      }}
      className={className}
      sx={{ ...customStyles, ...inputSx }}
    >
      {newOption === undefined || newOption.trim().length === 0
        ? options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))
        : [newOption].map((option: string, index: number) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
    </TextField>
  );
};

export default MaterialUiSelectWrapper;

