import {useTranslation} from "react-i18next";
import "./regionSorting.css";
import {useRef, useState} from "react";
import Arrow from "../../../../assets/arrow.svg";
import SortingIcon from "../../../../assets/sortingIcon.svg";
import {EonUiButton, EonUiText} from "@eon-ui/eon-ui-components-react";
import MaterialButtonWrapper
    from "../../../customUiElements/materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";

interface Props {
    [key: string]: any;

    handleSortingOptionsChange: (key: string, value: string) => void;
    resetSorting: () => void;
}

type CheckboxRefs = {
    [key: string]: HTMLInputElement | null;
};

const RegionSorting: React.FC<Props> = (props: Props) => {
    const {t} = useTranslation();
    const [allToggled, setAllToggled] = useState(false);
    const checkboxRefs = useRef<CheckboxRefs>({});
    const [toggleStates, setToggleStates] = useState({
        customer: false,
        division: false,
        distribution: false,
    });

    const handleResetSortingClick = () => {
        setToggleStates({
            customer: false,
            division: false,
            distribution: false,
        });
        props.resetSorting();

        for (const key in checkboxRefs.current) {
            if (checkboxRefs.current[key]) {
                checkboxRefs.current[key]!.checked = false;
            }
        }
    };

    const handleSortingIconClick = () => {
        setToggleStates(() => ({
            customer: !allToggled,
            division: !allToggled,
            distribution: !allToggled,
        }));
        setAllToggled(!allToggled);
    };

    const handleClick = (toggle: keyof typeof toggleStates) => {
        setToggleStates((prevState) => ({
            ...prevState,
            [toggle]: !prevState[toggle],
        }));
    };

    const sortOptions: Record<string, JSX.Element[]> = {};

    // for each prop set generate a checkbox and a label for the dropdown
    for (const key in props) {
        if (
            Object.prototype.hasOwnProperty.call(props, key) &&
            !(key === "handleSortingOptionsChange" || key === "resetSorting")
        ) {
            sortOptions[key] = [];
            for (const value of props[key]) {
                sortOptions[key].push(
                    <div
                        className="sorting-checkbox-wrapper"
                        key={sortOptions[key].length}
                    >
                        <label className="sorting-checkbox-row">
                            <input
                                type="checkbox"
                                name=""
                                className="checkbox"
                                id={value}
                                ref={(prev) => (checkboxRefs.current[value] = prev)}
                                onChange={() => props.handleSortingOptionsChange(key, value)}
                            />
                            <span className="checkmark"></span>
                            <label className="sorting-option-label" htmlFor={value}>
                                {value}
                            </label>
                        </label>
                    </div>,
                );
            }
        }
    }

    // again for each prop generate the dropdown and insert the checkboxes and labels
    const mappedOptions = Object.entries(props).map(([key, value], index) => {
        if (key === "handleSortingOptionsChange" || key === "resetSorting") return null;
        return (
            <div
                key={key}
                className={
                    "sorting-section" +
                    (toggleStates[key as keyof typeof toggleStates]
                        ? " sorting-expanded"
                        : "")
                }
            >
                <div className="sorting-label-bar" onClick={() => handleClick(key as keyof typeof toggleStates)}>
                    <p className="sorting-label">{t(key)}</p>
                    <div
                        className="sorting-icon-arrow"
                    >
                        <img src={Arrow} alt=""/>
                    </div>
                </div>
                <div className="sorting-section-body">{sortOptions[key]}</div>
            </div>
        );
    });

    return (
        <div className="sorting-container">
            <div className="sorting-icon" onClick={handleSortingIconClick}>
                <img src={SortingIcon} alt=""/>
            </div>
            {mappedOptions}
            <div className="sorting-button-wrapper">
                <MaterialButtonWrapper
                    label={t("reset")}
                    onClick={handleResetSortingClick}
                    variant="contained"
                    size="medium"
                />
            </div>
        </div>
    );
};

export default RegionSorting;
