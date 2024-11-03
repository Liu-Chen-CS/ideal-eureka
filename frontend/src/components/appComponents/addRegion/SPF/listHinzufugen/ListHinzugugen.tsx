import "./listHinzufugen.css";
import {useTranslation} from "react-i18next";
import {
  List,
  RegionForm,
} from "../../../../../forms/addRegion/regionFormConfig";
import {useFormikContext} from "formik";
import FileUploader from "../../../../customUiElements/fileUploader/FileUploader";
import SearchPlace from "../place/searchPlace/SearchPlace";
import {useState} from "react";
import MaterialUiAccordionWrapper
  from "../../../../customUiElements/materialUiWrapper/materialUiAccordionWrapper/materialUiAccordionWrapper";
import TextAreaWrapper from "../../../../customUiElements/textAreaWrapper/TextAreaWrapper";
import InputWrapper from "../../../../customUiElements/inputWrapper/InputWrapper";


interface Props {
  prefixName: string;
  regionId: string | undefined;
  createList: (list: List) => void
  isFileLoading:boolean;
  handleFileLoading:()=>void,
}

const ListHinzugugen: React.FC<Props> = ({prefixName, regionId, createList, isFileLoading, handleFileLoading}) => {
  const {t} = useTranslation();

  const [places, setPlaces] = useState<
      { place_id: number; place_name: string; postcode: string }[]
  >([]);

  const {
    values: {mode},
  } = useFormikContext<RegionForm>();

  const helper = (
      places: { place_id: number; place_name: string; postcode: string }[]
  ): void => {
    setPlaces(places);
  };
  return (
      <MaterialUiAccordionWrapper title={t("addList")}>
        <div className="spf-list-data-inner">
          <div className="list-left">
            <InputWrapper
                type="text"
                name={`${prefixName}.listName`}
                label={t("enterListName")}
            />
            <TextAreaWrapper name={`${prefixName}.listDetails`}/>
          </div>
          {mode === "create" ? (
              <div className="list-right">
                <FileUploader createList={createList} isFileLoading={isFileLoading} handleFileLoading={handleFileLoading}/>
              </div>
          ) : (
              <SearchPlace regionId={regionId} helper={helper}/>
          )}
        </div>
        {/*{(mode === "edit" || mode === "copy") && <PlaceInfo places={places} placesFront={null}/>}*/}
      </MaterialUiAccordionWrapper>
  );
};

export default ListHinzugugen;