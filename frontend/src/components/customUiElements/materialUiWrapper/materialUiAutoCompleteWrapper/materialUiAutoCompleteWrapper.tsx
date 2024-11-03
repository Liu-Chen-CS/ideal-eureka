import React from "react";
import { useField, useFormikContext } from "formik";
import { Autocomplete, TextField } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

interface MaterialUiAutoCompleteProps {
  name: string;
  label: string;
  options: string[];
  readOnly?: boolean;
  disabled?: boolean;
  inputSx?: SxProps<Theme>;
  className?: string;
}

const MaterialUiAutoCompleteWrapper: React.FC<MaterialUiAutoCompleteProps> = ({
  name,
  label,
  options,
  readOnly = false,
  inputSx,
  disabled = false,
  className,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

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
    "& .MuiInputLabel-root": {
      lineHeight: "1rem",
    },
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option}
      onChange={(event, value) => setFieldValue(name, value)}
      value={field.value || ""}
      isOptionEqualToValue={(option, value) => option === value || value === ""}
      className={className}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
          InputProps={{
            ...params.InputProps,
            readOnly,
            sx: {
              cursor: disabled ? "not-allowed" : "default",
            },
          }}
          sx={{ ...customStyles, ...inputSx }}
        />
      )}
    />
  );
};export default MaterialUiAutoCompleteWrapper;
