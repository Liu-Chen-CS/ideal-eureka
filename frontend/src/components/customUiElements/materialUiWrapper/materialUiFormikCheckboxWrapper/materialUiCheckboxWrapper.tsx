import React from "react";
import { useField, useFormikContext } from "formik";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  SxProps,
  Theme,
} from "@mui/material";

interface MaterialUiFormikCheckboxWrapperProps {
  name: string;
  label?: string;
  disabled?: boolean;
  inputSx?: SxProps<Theme>;
  className?: string;
}

const MaterialUiFormikCheckboxWrapper: React.FC<MaterialUiFormikCheckboxWrapperProps> = ({
  name,
  label,
  disabled = false,
  inputSx,
  className,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setFieldValue(name, value);
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
          <Checkbox
            {...field}
            checked={field.value}
            onChange={handleChange}
            disabled={disabled}
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

export default MaterialUiFormikCheckboxWrapper;

