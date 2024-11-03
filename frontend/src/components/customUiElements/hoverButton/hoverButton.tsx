import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { EonUiText } from "@eon-ui/eon-ui-components-react";
import "./hoverButton.css";

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
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  const [containerWidth, setContainerWidth] = useState(55);

  const handleMouseEnter = () => {
    if (currentLanguage === "de") {
      setContainerWidth(deWidth || 300);
    } else if (currentLanguage === "en") {
      setContainerWidth(enWidth || 300);
    }
  };

  const handleMouseLeave = () => {
    setContainerWidth(55);
  };

  return (
    <div
      onClick={onClick}
      className="hover-button-container"
      style={{ width: containerWidth }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="hover-button">
        <img className="hover-button-icon" src={iconPath} alt="" />
        <EonUiText
          className="hover-button-label"
          color="eon-neutral100"
          fontWeight="bold"
        >
          {t(label)}
        </EonUiText>
      </button>
    </div>
  );
};

export default HoverButton;
