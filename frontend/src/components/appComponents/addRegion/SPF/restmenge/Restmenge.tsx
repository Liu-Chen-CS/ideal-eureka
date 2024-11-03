import "./restmenge.css";
import { useTranslation } from "react-i18next";
import MaterialUiAccordionWrapper
  from "../../../../customUiElements/materialUiWrapper/materialUiAccordionWrapper/materialUiAccordionWrapper";
import InputWrapper from "../../../../customUiElements/inputWrapper/InputWrapper";


interface Props {
  prefixName: string;
}

const Restmenge: React.FC<Props> = ({ prefixName }) => {
  const { t } = useTranslation();

  return (
      <MaterialUiAccordionWrapper title={t("restmenge")}>
        <InputWrapper
            type="text"
            name={`${prefixName}`}
            label={t("remainingQuantityLabel")}
        />
      </MaterialUiAccordionWrapper>

  );
};
export default Restmenge;