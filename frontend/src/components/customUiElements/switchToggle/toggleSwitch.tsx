import React from "react";
import { useTranslation } from "react-i18next";

interface ToggleSwitchProps {
  optionLeft: string;
  optionRight: string;
  onToggle: (selectedOption: string) => void;
  defaultOption: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  optionLeft,
  optionRight,
  onToggle,
  defaultOption,
}) => {
  const [selectedOption, setSelectedOption] = React.useState(defaultOption);

  const { t } = useTranslation();

  const handleToggle = (option: string) => {
    console.log(option);
    setSelectedOption(option);
    onToggle(option);
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <span style={styles.label as React.CSSProperties}>{t(optionLeft)}</span>
      <div
        style={styles.switchContainer as React.CSSProperties}
        onClick={() =>
          handleToggle(selectedOption === optionLeft ? optionRight : optionLeft)
        }
      >
        <div
          style={
            {
              ...styles.switch,
              transform:
                selectedOption === optionRight
                  ? "translateX(28px)"
                  : "translateX(0)",
            } as React.CSSProperties
          }
        />
      </div>
      <span style={styles.label as React.CSSProperties}>{t(optionRight)}</span>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
  },
  label: {
    margin: "0 10px",
    fontSize: "18px",
  },
  switchContainer: {
    width: "60px",
    height: "30px",
    borderRadius: "24px",
    border: "3px solid rgb(230, 227, 225)",
    position: "relative" as "relative",
    cursor: "pointer",
  },
  switch: {
    width: "30px",
    left: "1px",
    height: "30px",
    backgroundColor: "rgb(176, 4, 2)",
    borderRadius: "50%",
    position: "absolute" as "absolute",
    transition: "transform 0.3s",
  },
};

export default ToggleSwitch;
