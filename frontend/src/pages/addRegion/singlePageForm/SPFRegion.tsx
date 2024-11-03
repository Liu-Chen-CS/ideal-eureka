import "./SPFRegion.css";
import SaveIcon from "../../../assets/save.svg";
import HoverButton from "../../../components/customUiElements/hoverButton/hoverButton";
import {Form, Formik, FormikProps} from "formik";
import {
    List,
    RegionForm,
    validationSchemaSPFRegionForm,
} from "../../../forms/addRegion/regionFormConfig";
import {useTranslation} from "react-i18next";
import RegionDivision from "../../../components/appComponents/addRegion/SPF/regionDivision/RegionDivision";
import ListHinzugugen from "../../../components/appComponents/addRegion/SPF/listHinzufugen/ListHinzugugen";
import Restmenge from "../../../components/appComponents/addRegion/SPF/restmenge/Restmenge";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ConfirmModal from "../../../components/customUiElements/confirmBackModal/confirmBackModal";
import {useNewRegion} from "../../../hooks/hooks";
import ListDetails from "../../../components/appComponents/addRegion/SPF/listDetails/ListDetails";
import MaterialButtonWrapper
    from "../../../components/customUiElements/materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";

interface SPFRegionProps {
    confirmBack: () => void;
    options: string[];
    mode: "edit" | "create" | "copy";
    handleInitialValues: (mode: "edit" | "create" | "copy") => RegionForm;
    regionId: string | undefined;
    checkDuplicates: (userInput: RegionForm) => boolean;
    handleReloader?: () => void;
}

const SPFRegion: React.FC<SPFRegionProps> = (
    {
        confirmBack,
        options,
        mode,
        handleInitialValues,
        regionId,
        checkDuplicates,
    }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [dataMissingModal, setDataMissingModal] = useState<boolean>(false);
    const [modalTexts, setModalTexts] = useState(["", ""]);
    const [list, setList] = useState<List[]>([]);
    const [listContainerFinal, setListContainerFinal] = useState<List[] | null>(null);
    const createList = (list: List) => {
        setList((prev) => [...prev, list])
    }
    const [isFileLoading, setIsFileLoading] = useState<boolean>(false);

    const deleteList = useCallback((id: number) => {
        setList((prevState) => {
            console.log("List - prevState", prevState);
            return prevState.filter((item: List) => item.id !== id);
        })
        setListContainerFinal((prevState) => {
            const prevStateCopy = prevState as List[];
            console.log("prevState - listContainerFinal", prevStateCopy);
            return prevStateCopy.filter((item: List) => item.id !== id);
        })
    }, [list, listContainerFinal]);

    const transmitter = useCallback((updatedList: List) => {
        console.log("updatedList", updatedList);
        setListContainerFinal((prevState) => {
            if (prevState === null) {
                prevState = [];
            }
            const updatedState = prevState.map((item) => item.id === updatedList.id ? updatedList : item);
            if (!updatedState.some(item => item.id === updatedList.id)) {
                return [...updatedState, updatedList];
            }
            return updatedState;
        });

        setList((prevState) => {
            const updatedState = prevState.map((item) => item.id === updatedList.id ? updatedList : item);
            if (!updatedState.some(item => item.id === updatedList.id)) {
                return [...updatedState, updatedList];
            }
            return updatedState;
        });
    }, [list, listContainerFinal]);

    const {addNewRegion} = useNewRegion();

    const handleOk = (values: RegionForm, regionId: string | undefined) => {
        console.log("handleOk", values);
        if (values.mode === "edit" || values.mode === "create") {
            addNewRegion(values, regionId);
        } else if (values.mode === "copy") {
            if (modalTexts.includes("Duplicat Error")) {
                setShowModal(false);
            } else {
                const isDuplicate: boolean = checkDuplicates(values);
                if (!isDuplicate) {
                    addNewRegion(values, undefined);
                } else {
                    setShowModal(true);
                    setModalTexts(["Duplicat Error", "Dataset already exists. (Duplicat)"]);
                }
            }
        }
    };

    const handleOkDataMissing = () => {
        console.log("handleOkDataMissing");
        setModalTexts([]);
    }

    const {t} = useTranslation();

    const initialValuesRegionForm = useMemo(() => {
        const res = handleInitialValues(mode)
        console.log(res);
        return res;
    }, [mode]);

    const formikRef = React.useRef<FormikProps<RegionForm>>(null);

    const checkDataMissing = useCallback(() => {
        if (formikRef.current) {
            const isDataMissing = formikRef.current.values.list?.some((list: List) => list.listInfo.listName === "" || list.listInfo.listDetails === "");
            if (isDataMissing) {
                setDataMissingModal(true);
                setModalTexts([t("incorrectInputFields"), t("checkInputFields")]);
            }
        }
    }, []);

    const handleSubmit = (): void => {
        setModalTexts([t("confirmSaveRegionHeading"), t("confirmSaveREgionSubHeading")]);
        setShowModal(true);
    };

    const handleFileLoading = () => {
        setIsFileLoading(true);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsFileLoading(false);
        }, 300)
    }, [list]);

    useEffect(() => {
        if (formikRef.current) {
            if (Array.isArray(listContainerFinal) && listContainerFinal.length === 0) {
                formikRef.current.setFieldValue("list", null);
            } else {
                formikRef.current.setFieldValue("list", listContainerFinal);
            }
        }
    }, [listContainerFinal]);

    return (
        <div className="SPF-region-container">
            <HoverButton
                iconPath={SaveIcon}
                label={t("buttonSave")}
                deWidth={170}
                enWidth={120}
                onClick={handleSubmit}
            />
            <Formik
                innerRef={formikRef}
                initialValues={initialValuesRegionForm}
                validationSchema={validationSchemaSPFRegionForm}
                onSubmit={handleSubmit}
                validateOnChange={false}
                validateOnBlur={true}
            >
                {(formik: FormikProps<RegionForm>) => {
                    return (
                        <>
                            {
                                dataMissingModal && (
                                    <ConfirmModal
                                        closeModal={() => setDataMissingModal(false)}
                                        confirmationFunction={() => {
                                            setDataMissingModal(false);
                                            handleOkDataMissing();
                                        }}
                                        heading={modalTexts[0]}
                                        subHeading={modalTexts[1]}
                                        confirmButtonText="Okay"
                                    />
                                )
                            }
                            {showModal && (
                                <ConfirmModal
                                    closeModal={() => setShowModal(false)}
                                    confirmationFunction={() => {
                                        setShowModal(false);
                                        handleOk(formik.values, regionId);
                                    }}
                                    heading={modalTexts[0]}
                                    subHeading={modalTexts[1]}
                                    confirmButtonText="Okay"
                                />
                            )}
                            <Form onSubmit={formik.handleSubmit}>
                                <RegionDivision
                                    prefixName="regionDivisionConfig"
                                    options={options}
                                />
                                {formik.values.mode === "create" && (
                                    <ListHinzugugen
                                        prefixName="listHinzufugen"
                                        regionId={regionId}
                                        createList={createList}
                                        isFileLoading={isFileLoading}
                                        handleFileLoading={handleFileLoading}
                                    />
                                )
                                }
                                <Restmenge prefixName="restmenge"/>
                                {
                                    mode === "create" ? (list.map((item: List, index: number) => {
                                        return (
                                            <ListDetails
                                                key={index}
                                                indexNum={index}
                                                regionId={regionId}
                                                listName={item.listInfo.listName}
                                                listDetails={item.listInfo.listDetails}
                                                transmitter={transmitter}
                                                deleteList={deleteList}
                                                item={item}
                                                uniqueId={item.id}
                                            />
                                        )
                                    })) : (initialValuesRegionForm.list?.map((item: List, index: number) => {
                                        return (<ListDetails
                                            key={index}
                                            indexNum={index}
                                            regionId={regionId}
                                            listName={item.listInfo.listName}
                                            listDetails={item.listInfo.listDetails}
                                            transmitter={transmitter}
                                            deleteList={deleteList}
                                            item={item}
                                            uniqueId={item.id}
                                        />)
                                    }))
                                }
                                <div className="single-page-form-button-row">
                                    <MaterialButtonWrapper
                                        variant="outlined"
                                        onClick={(): void => confirmBack()}
                                        label={t("goBack")}
                                    />
                                    <MaterialButtonWrapper
                                        variant="contained"
                                        onClick={checkDataMissing}
                                        label={t("buttonSave")}
                                    />
                                </div>
                                <pre>{JSON.stringify(formik, null, 2)}</pre>
                            </Form>
                        </>
                    );
                }}
            </Formik>
        </div>
    );
};

export default SPFRegion;