import React from "react";
import { useField, useFormikContext } from "formik";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  SxProps,
  Theme,
} from "@mui/material";

interface MaterialUiSwitchWrapperProps {
  name: string;
  label?: string;
  disabled?: boolean;
  inputSx?: SxProps<Theme>;
  className?: string;
  onToggle?: (value: boolean) => void; 
}

const MaterialUiSwitchWrapper: React.FC<MaterialUiSwitchWrapperProps> = ({
  name,
  label,
  disabled = false,
  inputSx,
  className,
  onToggle,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    setFieldValue(name, value);

    if (onToggle) {
      onToggle(value);
    }
  };

  return (
    <FormControl
      fullWidth
      error={meta.touched && Boolean(meta.error)}
      className={className}
      sx={inputSx}
    >
      <FormControlLabel
        control={
          <Switch
            {...field}
            checked={field.value}
            onChange={handleChange}
            disabled={disabled}
            sx={{
              fontFamily: "EONBrixSans, Arial, Geneva, Helvetica, sans-serif",
            }}
          />
        }
        label={label}
      />
      {meta.touched && meta.error ? (
        <FormHelperText>{meta.error}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default MaterialUiSwitchWrapper;
