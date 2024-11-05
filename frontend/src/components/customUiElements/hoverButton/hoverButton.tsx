import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {EonUiText} from "@eon-ui/eon-ui-components-react";
import "./hoverButton.css";
import AddIcon from "@mui/icons-material/Add";

type HoverButtonProps = {
    iconPath: string;
    label: string;
    deWidth?: number;
    enWidth?: number;
    onClick?: () => void;
};

const HoverButton: React.FC<HoverButtonProps> = ({
                                                     iconPath,
                                                     label,
                                                     deWidth,
                                                     enWidth,
                                                     onClick
                                                 }) => {
    const {t} = useTranslation();
    const currentLanguage = i18n.language;
    const [containerWidth, setContainerWidth] = useState(70);

    const handleMouseEnter = (): void => {
        if (currentLanguage === "de") {
            setContainerWidth(deWidth || 500);
        } else if (currentLanguage === "en") {
            setContainerWidth(enWidth || 500);
        }
    };

    const handleMouseLeave = (): void => {
        setContainerWidth(70);
    };

    return (
        <div
            onClick={onClick}
            className="hover-button-container"
            style={{width: containerWidth}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className="hover-button">
                <img className="hover-button-icon" src={iconPath} alt=""/>
                <span className="hover-button-label">{t(label)}</span>
            </button>
        </div>
    );
};

export default HoverButton;
