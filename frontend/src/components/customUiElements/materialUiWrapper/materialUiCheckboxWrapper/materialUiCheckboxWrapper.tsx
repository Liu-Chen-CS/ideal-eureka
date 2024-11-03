import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface MaterialUiCheckboxWrapperProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  color?: "primary" | "secondary" | "default";
}

const MaterialUiCheckboxWrapper: React.FC<MaterialUiCheckboxWrapperProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  color = "primary",
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color={color}
          disabled={disabled}
        />
      }
      label={label}
    />
  );
};

export default MaterialUiCheckboxWrapper;
