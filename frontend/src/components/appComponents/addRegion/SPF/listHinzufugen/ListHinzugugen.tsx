import "./listHinzufugen.css";
import {useTranslation} from "react-i18next";
import {
    List,
    RegionForm,
} from "../../../../../forms/addRegion/regionFormConfig";
import {useFormikContext} from "formik";
import FileUploader from "../../../../customUiElements/fileUploader/FileUploader";
import SearchPlace from "../place/searchPlace/SearchPlace";
import {useCallback, useEffect, useState} from "react";
import MaterialUiAccordionWrapper
    from "../../../../customUiElements/materialUiWrapper/materialUiAccordionWrapper/materialUiAccordionWrapper";
import MaterialUiInputWrapper
    from "../../../../customUiElements/materialUiWrapper/materialUiInputWrapper/materialUiInputWrapper";
import MaterialMultilineInputWrapper
    from "../../../../customUiElements/materialUiWrapper/materialMultilineInputWrapper/MaterialMultilineInputWrapper";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface Props {
    prefixName: string;
    regionId: string | undefined;
    createList: (list: List) => void
    isFileLoading: boolean;
    handleFileLoading: () => void,
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

    const downloadTypoFile = useCallback((): void => {
        const fileUrl = `${process.env.PUBLIC_URL}/dirty_place_name.csv`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "TypoFile.csv";
        link.click();
    }, []);

    const downloadIncorrectFormatFile = useCallback((): void => {
        const fileUrl = `${process.env.PUBLIC_URL}/placeList_CSVInvalidFormat.csv`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "incorrectFormatFile.csv";
        link.click();
    }, []);

    const downloadCleanedFile = useCallback((): void => {
        const fileUrl = `${process.env.PUBLIC_URL}/deutschlandweit.csv`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "cleanedFile.csv";
        link.click();
    }, []);

    return (
        <div className="list-hinzufugen-container">
            <MaterialUiAccordionWrapper title={t("addList")}>
                <div className="spf-list-data-inner">
                    <div className="list-left">
                        <MaterialUiInputWrapper
                            type="text"
                            name={`${prefixName}.listName`}
                            label={t("enterListName")}
                        />
                        <MaterialMultilineInputWrapper name={`listHinzufugen.listDetails`}/>
                    </div>
                    {mode === "create" ? (
                        <div className="list-right">
                            <FileUploader createList={createList} isFileLoading={isFileLoading}
                                          handleFileLoading={handleFileLoading}/>
                        </div>
                    ) : (
                        <SearchPlace regionId={regionId} helper={helper}/>
                    )}
                </div>
            </MaterialUiAccordionWrapper>
            <div className="file-download-container">
                <div className="top">
                    <span>{`${t("downloadFileForTest")}:`}</span>
                </div>
                <div className="bottom">
                    <ul>
                        <li className="file with typos" onClick={downloadTypoFile}>
                            <span>{t("typos")}</span>
                            <FileDownloadOutlinedIcon/>
                        </li>
                        <li className="file with incorrect format" onClick={downloadIncorrectFormatFile}>
                            <span>{t("incorrectFormat")}</span>
                            <FileDownloadOutlinedIcon/>
                        </li>
                        <li className="clean file" onClick={downloadCleanedFile}>
                            <span>{t("clean")}</span>
                            <FileDownloadOutlinedIcon/>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ListHinzugugen;