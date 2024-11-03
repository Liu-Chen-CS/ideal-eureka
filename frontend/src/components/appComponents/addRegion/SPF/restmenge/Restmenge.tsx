import "./restmenge.css";
import { useTranslation } from "react-i18next";
import MaterialUiAccordionWrapper
  from "../../../../customUiElements/materialUiWrapper/materialUiAccordionWrapper/materialUiAccordionWrapper";
import MaterialInputAdornmentWrapper from "../../../../customUiElements/materialUiWrapper/materialInputAdornmentWrapper/MaterialInputAdornmentWrapper";
import MaterialUiInputWrapper
    from "../../../../customUiElements/materialUiWrapper/materialUiInputWrapper/materialUiInputWrapper";


interface Props {
  prefixName: string;
}

const Restmenge: React.FC<Props> = ({ prefixName }) => {
  const { t } = useTranslation();

  return (
      <MaterialUiAccordionWrapper title={t("restmenge")}>
        <MaterialUiInputWrapper
            type="text"
            name={`${prefixName}`}
            label={t("remainingQuantityLabel")}
        />
      </MaterialUiAccordionWrapper>

  );
};
export default Restmenge;