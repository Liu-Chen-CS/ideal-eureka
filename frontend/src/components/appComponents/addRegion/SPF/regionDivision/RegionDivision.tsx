import "./regionDivision.css";
import { useTranslation } from "react-i18next";
import { RegionForm } from "../../../../../forms/addRegion/regionFormConfig";
import { useFormikContext } from "formik";
import { useCallback, useState } from "react";
import MaterialUiSelectWrapper from "../../../../customUiElements/materialUiWrapper/materialUiSelectWrapper/materialUiSelectWrapper";
import MaterialUiAccordionWrapper
  from "../../../../customUiElements/materialUiWrapper/materialUiAccordionWrapper/materialUiAccordionWrapper";
import MaterialInputAdornmentWrapper from "../../../../customUiElements/materialUiWrapper/materialInputAdornmentWrapper/MaterialInputAdornmentWrapper";
import MaterialUiTextFieldWrapper
  from "../../../../customUiElements/materialUiWrapper/materialUiInputWrapper/materialUiInputWrapper";
import MaterialUiInputWrapper
  from "../../../../customUiElements/materialUiWrapper/materialUiInputWrapper/materialUiInputWrapper";

interface Props {
  prefixName: string;
  options: string[];
}

const RegionDivision: React.FC<Props> = ({ prefixName, options }) => {
  const { t } = useTranslation();

  const { values, setFieldValue } = useFormikContext<RegionForm>();

  const [newOption, setNewOption] = useState("");

  const handleAddNewOption = useCallback(() => {
    const {
      regionDivisionConfig: { newRegionDivision },
    } = values;
    if (newRegionDivision) {
      setFieldValue(
          "regionDivisionConfig.regionDivisionOption",
          newRegionDivision
      );
      setNewOption(newRegionDivision);
    }
  }, [values, newOption]);

  return (
      <MaterialUiAccordionWrapper title={t("regionDivisionConfig")}>
        <div className="spf-regionDivision-data-inner">
          <MaterialInputAdornmentWrapper
              type="text"
              name={`${prefixName}.newRegionDivision`}
              label={"addNewRegionDivisionLabel"}
              // onIconClick={handleAddNewOption}
          />
          <MaterialUiSelectWrapper
              name="regionDivisionConfig.regionDivisionOption"
              options={options}
              label={t("regionDivision")}
              newOption={newOption}
          />
          <MaterialUiInputWrapper
              type="text"
              name={`${prefixName}.version`}
              label="Version"
          />
          <MaterialUiSelectWrapper
              name={`${prefixName}.branch`}
              options={["Strom", "Gas"]}
              label={t("section")}
          />
          <MaterialUiSelectWrapper
              name={`${prefixName}.client`}
              options={["Privat", "Gewerbe"]}
              label={t("customerSegmentInputPlaceholder")}
          />
        </div>
      </MaterialUiAccordionWrapper>
  );
};

export default RegionDivision;
