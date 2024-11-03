import "./inputWrapper.css";


interface Props {
    type: string;
    name: string;
    label: string;
    onIconClick?: () => void;
}

const InputWrapper: React.FC<Props> = () => {
    return (
        <div className="input-wrapper-container">
            123
        </div>
    );
};
export default InputWrapper;