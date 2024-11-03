import {TextField} from "@mui/material";

interface Props {
    name: string;
    disabled?: boolean;
}

const MaterialMultilineInputWrapper: React.FC<Props> = ({name, disabled}) => {
    const customStyles = {
        "& .MuiOutlinedInput-root": {
            fontSize: "18px",
            // height: "48px",
            width: "600px",
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
        <div className="materialMultilineInputWrapper-container">
            <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                rows={4}
                defaultValue="Default Value"
                sx={customStyles}
            />
        </div>
    );
};
export default MaterialMultilineInputWrapper;