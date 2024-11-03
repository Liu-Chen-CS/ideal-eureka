import {Button} from "@mui/material";

interface Props {
    variant: "contained" | "outlined",
    onClick: () => void;
    label: string;
    size?: "small" | "medium" | "large";
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const MaterialButtonWrapper: React.FC<Props> = ({
                                                    variant,
                                                    onClick,
                                                    label,
                                                    size,
                                                    startIcon,
                                                    endIcon,
                                                }) => {
    const customizedColor = {
        ...(variant === "contained" && {
            backgroundColor: "#EA1B0A",
            color: "white",
            border: "none",
            '&:hover': {
                backgroundColor: "darkred",
            },
        }),
        ...(variant === "outlined" && {
            backgroundColor: "transparent",
            color: "#EA1B0A",
            border: "1px solid #EA1B0A",
            '&:hover': {
                backgroundColor: "rgba(234, 27, 10, 0.1)",
                border: "1px solid #EA1B0A",
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
            >
                {label}
            </Button>
        </div>
    );
};
export default MaterialButtonWrapper;