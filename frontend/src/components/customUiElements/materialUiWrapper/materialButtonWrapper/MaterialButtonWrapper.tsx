import {Button} from "@mui/material";

interface Props {
    variant: "contained" | "outlined",
    onClick: () => void;
    label: string;
}

const MaterialButtonWrapper: React.FC<Props> = ({variant, onClick, label}) => {
    return (
        <div className="material-button-wrapper-container">
            <Button
                variant={variant}
                onClick={onClick}
            >
                {label}
            </Button>
        </div>
    );
};
export default MaterialButtonWrapper;