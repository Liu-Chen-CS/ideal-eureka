import React from "react";
import {useField, useFormikContext} from "formik";
import {TextField} from "@mui/material";
import {SxProps, Theme} from "@mui/system";

interface MaterialUiTextFieldWrapperProps {
    name: string;
    label?: string;
    readOnly?: boolean;
    disabled?: boolean;
    inputSx?: SxProps<Theme>;
    className?: string;
    type?: string;
    placeholder?: string;
    onValueChanged?: (e: any) => void;
}

const MaterialUiTextFieldWrapper: React.FC<MaterialUiTextFieldWrapperProps> = ({
                                                                                   name,
                                                                                   label,
                                                                                   readOnly = false,
                                                                                   disabled = false,
                                                                                   inputSx,
                                                                                   className,
                                                                                   type = "text",
                                                                                   placeholder,
                                                                                   onValueChanged,
                                                                               }) => {
    const {setFieldValue} = useFormikContext();
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
    };

    return (
        <TextField
            {...field}
            label={label}
            type={type}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
            InputProps={{
                readOnly,
            }}
            disabled={disabled}
            className={className}
            sx={{...customStyles, ...inputSx}}
        />
    );
};

export default MaterialUiTextFieldWrapper;

