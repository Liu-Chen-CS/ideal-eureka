import "./listDetails.css";
import SearchPlace from "../place/searchPlace/SearchPlace";
import PlaceInfo from "../place/PlaceInfo";
import {useTranslation} from "react-i18next";
import {List, Place, RegionForm} from "../../../../../forms/addRegion/regionFormConfig";
import React, {useEffect, useState, useCallback, useMemo} from "react";
import {useFormikContext} from "formik";
import ConfirmModal from "../../../../customUiElements/confirmBackModal/confirmBackModal";
import MaterialUiAccordionWrapper
    from "../../../../customUiElements/materialUiWrapper/materialUiAccordionWrapper/materialUiAccordionWrapper";
import MaterialButtonWrapper
    from "../../../../customUiElements/materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";

interface Props {
    indexNum: number;
    regionId: string | undefined;
    listName: string;
    listDetails: string;
    transmitter: (list: List) => void;
    deleteList: (indexNum: number) => void;
    item: List;
    uniqueId: number;
}

const ListDetails: React.FC<Props> = ({
                                          indexNum,
                                          regionId,
                                          listName,
                                          listDetails,
                                          transmitter,
                                          deleteList,
                                          item,
                                          uniqueId,
                                      }) => {
    const {values} = useFormikContext<RegionForm>();
    const [currentTimer, setCurrentTimer] = useState<NodeJS.Timeout>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTexts, setModalTexts] = useState(["", ""]);
    const handleDeleteList = () => {
        setModalTexts(["Liste '' löschen?", "Möchtest du die Liste wirklich löschen?"]);
        setShowModal(true);
    };
    const {t} = useTranslation();
    const [listNameValues, setListNameValues] = useState<string>(listName);
    const [listNameError, setListNameError] = useState<boolean>(true);
    const [placeListInfo, setPlaceListInfo] = useState<Place[]>(item.placeList);
    const [listDetailsValues, setListDetailsValues] = useState<string>(listDetails);
    const [listDetailsError, setListDetailsError] = useState<boolean>(true);

    const placeListWithSymboleId: Place[] = useMemo(() => {
        console.log("useMemo", item)
        return item.placeList.map((place: Place) => ({...place, id: Symbol(place.placeName)}));
    }, [uniqueId]);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleSearchTerm = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    }
    const handleOk = useCallback((listId: number) => {
        deleteList(listId);
    }, []);


    const checkListName = useCallback(() => {
        if (listNameValues.trim().length > 0) {
            setListNameError(false);
        } else {
            setListNameError(true);
        }
    }, [listNameValues, listNameError]);

    const checkListDetails = useCallback(() => {
        if (listDetailsValues.trim().length > 0) {
            setListDetailsError(false);
        } else {
            setListDetailsError(true);
        }
    }, [listDetailsValues, listDetailsError]);

    const toListDetails = useCallback((placeListFromPlaceInfo: Place[]) => {
        setPlaceListInfo(placeListFromPlaceInfo);
    }, [placeListInfo]);

    useEffect(() => {
        checkListName();
        checkListDetails();
        if (currentTimer) {
            clearTimeout(currentTimer);
        }
        const timer = setTimeout(() => {
            transmitter(
                {
                    id: item.id,
                    placeList: placeListInfo,
                    listInfo: {
                        listName: listNameValues,
                        listDetails: listDetailsValues,
                    }
                }
            );
        }, 1000);
        setCurrentTimer(timer);
        return (() => {
            clearTimeout(timer)
        });
    }, [listNameValues, listDetailsValues, placeListInfo]);

    useEffect(() => {
        if (listName !== listNameValues) {
            setListNameValues(listName);
        }
        if (listDetails !== listDetailsValues) {
            setListDetailsValues(listDetails);
        }
        setPlaceListInfo(item.placeList);
    }, [listName, listDetails, uniqueId]);

    return (
        <MaterialUiAccordionWrapper title={`list ${indexNum + 1} - ${listNameValues}`}>
            {showModal && (
                <ConfirmModal
                    closeModal={() => setShowModal(false)}
                    confirmationFunction={() => {
                        setShowModal(false);
                        handleOk(item.id);
                    }}
                    heading={modalTexts[0]}
                    subHeading={modalTexts[1]}
                    confirmButtonText="Okay"
                />
            )}

            <div className="spf-list-details-inner">
                <div className="list-left">
                    <div className="list-name-container">
                        <input
                            className={`${listNameError && "highlight"}`}
                            placeholder={`${t("enterListName")}*`}
                            type="text"
                            value={listNameValues}
                            onChange={(value) => {
                                setListNameValues(value.target.value)
                            }}>
                        </input>
                        {listNameError && <span>required</span>}
                    </div>
                    <div className="list-details-container">
                        <textarea
                            className={`${listDetailsError && "highlight"}`}
                            placeholder={`${t("enterDescription")}*`}
                            value={listDetailsValues}
                            onChange={(value) => {
                                setListDetailsValues(value.target.value)
                            }}>
                        </textarea>
                        {listDetailsError && <span>required</span>}
                    </div>
                </div>
                <div className="list-right">
                    <SearchPlace regionId={regionId} helper={() => {
                    }} handleSearchTerm={handleSearchTerm}/>
                    {
                        values.mode === "create" && (
                            <MaterialButtonWrapper
                                variant="contained"
                                onClick={handleDeleteList}
                                label={t("deleteList")}
                                type={"button"}
                            />
                        )
                    }
                </div>
            </div>
            {<PlaceInfo places={placeListWithSymboleId} searchTerm={searchTerm} toListDetails={toListDetails} uniqueId={uniqueId}/>}
        </MaterialUiAccordionWrapper>
    );
};
export default ListDetails;