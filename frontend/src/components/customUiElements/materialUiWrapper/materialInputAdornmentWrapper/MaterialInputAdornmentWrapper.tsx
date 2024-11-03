import {useField} from "formik";
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useState} from "react";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
    type: string;
    name: string;
    label: string;
    onIconClick?: () => void;
    disabled?: boolean;
}

const MaterialInputAdornmentWrapper: React.FC<Props> = ({type, name, label, onIconClick, disabled}) => {
    const customStyles = {
        "& .MuiOutlinedInput-root": {
            fontSize: "18px",
            height: "48px",
            width: "400px",
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

    const [field, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <div className="input-wrapper-container">
            <TextField
                {...field}
                label="With normal TextField"
                id="outlined-start-adornment"
                InputProps={{
                    endAdornment: <InputAdornment position="end"><SaveIcon/></InputAdornment>,
                }}
                sx={customStyles}
            />
        </div>
    );
};
export default MaterialInputAdornmentWrapper;