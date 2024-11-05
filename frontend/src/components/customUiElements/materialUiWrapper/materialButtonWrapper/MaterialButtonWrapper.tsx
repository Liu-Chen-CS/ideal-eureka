import {Button} from "@mui/material";

interface Props {
    variant: "contained" | "outlined",
    onClick: () => void;
    label: string;
    type: "button" | "submit" | "reset";
    size?: "small" | "medium" | "large";
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
}

const MaterialButtonWrapper: React.FC<Props> = ({
                                                    variant,
                                                    onClick,
                                                    label,
                                                    size,
                                                    startIcon,
                                                    endIcon,
                                                    type,
                                                    disabled,
                                                }) => {
    const customizedColor = {
        ...(variant === "contained" && {
            backgroundColor: "var(--siemens-third)",
            color: "black",
            border: "none",
            fontWeight: "bold",
            fontSize: "90px",
            letterSpacing: "2px",
            '&:hover': {
                backgroundColor: "var(--siemens-secondary)",
                boxShadow: "none",
            },
        }),
        ...(variant === "outlined" && {
            backgroundColor: "transparent",
            color: "black",
            border: "3px solid var(--siemens-third)",
            fontWeight: "bold",
            letterSpacing: "2px",
            '&:hover': {
                backgroundColor: "var(--siemens-secondary)",
                border: "3px solid var(--siemens-secondary)",
                boxShadow: "none",
            },
        }),
        borderRadius: "10px",
        boxShadow: "none",
        textTransform: "none",
        fontSize: 16,
    };

    return (
        <div className="material-button-wrapper-container">
            <Button
                variant={variant}
                onClick={onClick}
                size={size}
                sx={customizedColor}
                startIcon={startIcon && startIcon}
                endIcon={endIcon && endIcon}
                type={type}
                disabled={disabled}
            >
                {label}
            </Button>
        </div>
    );
};
export default MaterialButtonWrapper;