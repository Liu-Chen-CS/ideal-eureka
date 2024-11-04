import "./fileUploader.css";
import {useField, useFormikContext} from "formik";
import {useCallback, useRef, useState} from "react";
import {germanRegex, List, Place, RegionForm} from "../../../forms/addRegion/regionFormConfig";
import {useTranslation} from "react-i18next";
import alert from "../../../assets/alert.svg";
import close from "../../../assets/close.svg";
import contract from "../../../assets/contract.svg";
import ConfirmModal from "../confirmBackModal/confirmBackModal";
import upload from "../../../assets/upload.svg";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import MaterialButtonWrapper from "../materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";

interface Props {
    createList: (list: List) => void,
    isFileLoading: boolean,
    handleFileLoading: () => void,
}

type FileOutput = {
    type: "validFormat" | "invalidFormat" | "isDuplicate",
    data: Place[] | null,
    length?: number,
}

const FileUploader: React.FC<Props> = ({createList, isFileLoading, handleFileLoading}) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [field, meta] = useField("list");
    const {t} = useTranslation();
    const [placeList, setPlaceList] = useState<Place[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [showCancelButton, setShowCancelButton] = useState<boolean>(true);
    const [isSucceedUpload, setIsSucceedUpload] = useState<boolean>(false);
    const {setFieldValue, setFieldTouched, errors, values} = useFormikContext<RegionForm>();
    const [errorType, setErrorType] = useState<"notValidated" | "invalidFormat" | "isDuplicate" | "">("");

    const isDuplicate = (newArray: Place[], existingArrays: Place[][] | undefined) => {
        const cleanedArray: Place[] = newArray.filter((place: Place) => germanRegex.test(place.placeName))
        const newSet = new Set(cleanedArray.map((item) => `${item.postcode}-${item.placeName}`));
        return existingArrays?.some((existingArray) => {
            const existingSet = new Set(existingArray.map((item) => `${item.postcode}-${item.placeName}`));
            if (newArray.length === existingArray.length) {
                return isSetEqual(newSet, existingSet);
            } else if (newArray.length < existingArray.length) {
                return isSubset(newSet, existingSet);
            } else {
                return false;
            }
        });
    };
    const isSetEqual = (setA: Set<string>, setB: Set<string>) => {
        return Array.from(setA).every((item) => setB.has(item));
    };
    const isSubset = (subset: Set<string>, superset: Set<string>) => {
        return Array.from(subset).every((item) => superset.has(item));
    }

    const handleFileUploadClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const [showModal, setShowModal] = useState<boolean>(false);

    const [modalTexts, setModalTexts] = useState(["", ""]);

    const handleCreateList = () => {
        setIsSucceedUpload(false);
        setErrorType("");
        handleFileLoading();
        setFieldValue("listHinzufugen.listName", "");
        setFieldValue("listHinzufugen.listDetails", "");

        const list: List = {
            id: Date.now(),
            placeList: placeList,
            listInfo: {
                listName: values.listHinzufugen.listName,
                listDetails: values.listHinzufugen.listDetails
            }
        }
        createList(list);
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files?.[0];
        processFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };


    const parseCSV = (csvText: string): FileOutput => {

        const lines: string[] = csvText.split("\n").slice(0, -1);

        if (lines.length < 2) {
            return {type: "invalidFormat", data: null}
        }

        const header = lines[0].split(";");

        if (header.length < 2 || header[0].trim().toLowerCase() !== "plz" || header[1].trim().toLowerCase() !== "ort") {
            return {type: "invalidFormat", data: null}
        }

        const places: Place[] = [];

        for (let i = 1; i < lines.length - 1; i++) {
            const line: string = lines[i];
            const cleanedData: string[] = line.split(";").map((item: string) => item.trim().replace(/"/g, '').replace(/\r/g, ''));
            const isEmpty: boolean = cleanedData.some((item: string) => item.trim().length <= 0);
            if (!isEmpty) {
                places.push({
                    postcode: cleanedData[0],
                    placeName: cleanedData[1],
                });
            }
        }

        if (places.length < 1) {
            return {type: "invalidFormat", data: null}
        }

        const existingArr = values.list?.map((item: List) => item.placeList);

        const res = isDuplicate(places, existingArr);

        if (res) {
            return {type: "isDuplicate", data: null, length: places.length};
        } else {
            return {type: "validFormat", data: places};
        }
    };

    const [duplicateFileContent, setDuplicateFileContent] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        processFile(file);

        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
    };

    const processFile = (file: File | undefined) => {

        if (file) {
            setFileName(file.name);
            let fileSizeInKB: number;
            let size: string;

            const reader = new FileReader();
            reader.onload = (e) => {
                const csvText = e.target?.result as string;
                if (csvText) {
                    const {type, data, length} = parseCSV(csvText);
                    if (type === "invalidFormat") {
                        console.log(type);
                        setErrorType("invalidFormat");
                        setFieldTouched("list", true, true);
                    } else if (type === "isDuplicate") {
                        console.log("isDuplicate");
                        setShowModal(true);
                        setModalTexts(["Duplicate errors", `Es sind bereits Ortkombinationen ${length} vorhanden.`]);
                        setDuplicateFileContent(csvText);
                    } else {
                        fileSizeInKB = file.size / 1024;
                        size = fileSizeInKB < 1024
                            ? `${fileSizeInKB.toFixed(2)} KB`
                            : `${(fileSizeInKB / 1024).toFixed(2)} MB`
                        setFileSize(size);
                        setIsSucceedUpload(true);
                        setErrorType("notValidated");
                        data && setPlaceList(data);
                    }
                }
            };

            reader.readAsText(file);

        } else {
            console.log("emptyFile")
            setFieldTouched("list", true, true);
        }
    };

    const switchOffModal = useCallback(() => {
        setShowModal(false);
    }, []);

    return (
        isFileLoading ? (<div className="loading-icon-fileuploader"><LoadingSpinner/></div>) : (
            <div className="wrapper">
                {meta.touched && values.list === null || errorType === "invalidFormat" ? (
                    <div className="error-container">
                        <div className="error-left">
                            <img src={alert}/>
                        </div>
                        <div className="error-right">
                            <div className="file-info">
                                {
                                    errorType === "notValidated" ? (
                                        <span>{t("listNotValidated")}</span>) : (errorType === "invalidFormat" ? (
                                        <>
                                            <span className="file-name">{fileName}</span>
                                            <span>{t("falseDataFormat")}</span>
                                        </>
                                    ) : (
                                        values.list === null && (
                                            (<span>{t("listNotUploaded")}</span>)
                                        )
                                    ))
                                }
                            </div>
                            <div className="cancel-button" onClick={() => {
                                if (errorType === "notValidated") {
                                    setFieldTouched("list", false);
                                } else {
                                    setErrorType("");
                                    setFileName(null);
                                    setFileSize(null);
                                    setFieldTouched("list", false);
                                    setIsSucceedUpload(false);
                                }
                            }}>
                                <img src={close}/>
                            </div>
                        </div>
                    </div>
                ) : (isSucceedUpload ? (
                        <div className="success-container">
                            <div className="success-left">
                                <img src={contract}/>
                            </div>
                            <div className="success-right">
                                <div className="file-info">
                                    <span className="file-name">{fileName}</span>
                                    <span>{fileSize}</span>
                                </div>
                                <div className="cancel-button" onClick={() => {
                                    setIsSucceedUpload(false);
                                    setPlaceList([]);
                                    setFileSize(null);
                                    setErrorType("");
                                    setFileName(null);
                                }}>
                                    <img src={close}/>
                                </div>
                            </div>
                        </div>) : (
                        <div
                            className={`form ${isDragOver ? "drag-over" : ""}`}
                            onClick={handleFileUploadClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <img src={upload}></img>
                            <p>{t("pleaseDragAndDrop")}</p>
                            <p>{t("dataFormat")}</p>
                            <p>{t("fileStructure")}</p>
                            <input
                                onBlur={field.onBlur}
                                ref={inputFileRef}
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={handleFileChange}
                                name={field.name}
                            />
                        </div>
                    )
                )}
                <div className="upload-wrapper">
                    {(isSucceedUpload) ? (
                        <MaterialButtonWrapper
                            onClick={handleCreateList}
                            variant="contained"
                            label={t("validateList")}
                            type={"button"}
                        />
                    ) : (
                        <MaterialButtonWrapper
                            variant="contained"
                            label={t("selectFile")}
                            onClick={handleFileUploadClick}
                            type={"button"}
                            disabled={errorType === "invalidFormat" && true}
                        />)}

                </div>
                {showModal && (
                    <ConfirmModal
                        closeModal={() => setShowModal(false)}
                        confirmationFunction={() => {
                            setShowModal(false);
                        }}
                        heading={modalTexts[0]}
                        subHeading={modalTexts[1]}
                        confirmButtonText="Okay"
                        regionalCustomization={{
                            downloadTheme: {
                                content: duplicateFileContent,
                                msg: "Download der Duplikate",
                                switchOffModal,
                            },
                            correctTheme: null,
                        }}
                    />
                )
                }
            </div>
        )
    );
};

export default FileUploader;