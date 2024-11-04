import "./placeInfo.css";
import {germanRegex, Place} from "../../../../../forms/addRegion/regionFormConfig";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FixedSizeList as VirtualList} from 'react-window';
import {useTranslation} from "react-i18next";
import ConfirmModal from "../../../../customUiElements/confirmBackModal/confirmBackModal";
import MaterialButtonWrapper
    from "../../../../customUiElements/materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";

interface Props {
    places: Place[] | null;
    searchTerm?: string;
    toListDetails: (placeList: Place[]) => void;
    uniqueId:number;
}

const PlaceInfo: React.FC<Props> = ({places, searchTerm, toListDetails, uniqueId}) => {
    const [userInput, setUserInput] = useState<string | undefined>(searchTerm);
    const [placeList, setPlaceList] = useState<Place[]>(places as Place[]);
    const [invalidCount, setInvalidCount] = useState<number>(0);
    const [hasInvalidItems, setHasInvalidItems] = useState<boolean>(false);
    const {t} = useTranslation();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTexts, setModalTexts] = useState(["", ""]);
    const [totalPlaceData, setTotalPlaceData] = useState<Place[]>([]);
    const [availablePlaceForCorrection, setAvailablePlaceForCorrection] = useState<Place[] | null>(null);
    const [currentIncorrectPlace, setCurrentIncorrectPlace] = useState<Symbol>();

    const getPlaceFrontOutput = useMemo(() => {
        const normalizedSearchTerm = userInput?.trim().toLowerCase() || "";
        const placeListWithValidation: Place[] = placeList.map((place) => ({
            ...place,
            isValid: germanRegex.test(place.placeName),
        }));

        const sortedPlaceList = placeListWithValidation.sort((a, b) => {
            if (!a.isValid && b.isValid) return -1;
            if (a.isValid && !b.isValid) return 1;
            return 0;
        });

        if (normalizedSearchTerm.length === 0) {
            return {data: sortedPlaceList};
        } else {
            const filteredList = sortedPlaceList.filter((place) =>
                place.placeName.toLowerCase().includes(normalizedSearchTerm) ||
                place.postcode.includes(normalizedSearchTerm)
            );
            return {data: filteredList};
        }
    }, [userInput, placeList]);

    const handleCorrect = useCallback((postcode: string, id: symbol) => {
        setCurrentIncorrectPlace(id);
        setShowModal(true);
        setModalTexts([t("optionsInSystem"), ""]);
        const matchedPlaces: Place[] = totalPlaceData.filter((place: Place) => place.postcode.trim().match(postcode.trim()));
        if (matchedPlaces.length > 0) {
            setAvailablePlaceForCorrection(matchedPlaces);
        }
    }, [totalPlaceData]);

    const parseCSV = (csvText: string): Place[] => {
        const lines: string[] = csvText.split("\n");
        const places: Place[] = [];
        for (let i = 1; i < lines.length - 1; i++) {
            const line: string = lines[i];
            const cleanedData: string[] = line.split(";").map((item: string) => item.trim().replace(/"/g, '').replace(/\r/g, ''));
            places.push({
                postcode: cleanedData[0],
                placeName: cleanedData[1],
            });
        }
        return places;
    };

    const updatePlaceList = useCallback((placeName: string) => {
        setPlaceList((prevState) => (
            prevState.map((place: Place) => place.id === currentIncorrectPlace ? {
                ...place,
                placeName: placeName
            } : {...place})
        ))
    }, [getPlaceFrontOutput, currentIncorrectPlace]);

    const toPlaceInfo = useCallback((placeName: string) => {
        setShowModal(false);
        setModalTexts(["", ""]);
        updatePlaceList(placeName);
    }, [currentIncorrectPlace]);

    useEffect(() => {
        if (searchTerm !== userInput) {
            setUserInput(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        const invalidItems: Place[] = getPlaceFrontOutput.data.filter((place) => !place.isValid);
        setInvalidCount(invalidItems.length);
        setHasInvalidItems(invalidItems.length > 0);
    }, [placeList, userInput]);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/deutschlandweit.csv`)
            .then((response) => response.text())
            .then((data) => {
                const parsedData: Place[] = parseCSV(data);
                setTotalPlaceData(parsedData);
            });
    }, []);

    useEffect(() => {
        if (!hasInvalidItems) {
            console.log("clear place name data ---> sending placeList to parent component");
            toListDetails(placeList);
        } else {
            console.log("dirty place name data");
            console.log(placeList);
        }
    }, [hasInvalidItems]);

    useEffect(() => {
        setPlaceList(places as Place[]);
    }, [uniqueId]);

    return (
        <div className="place-info-container">
            {showModal && (
                <ConfirmModal
                    closeModal={() => setShowModal(false)}
                    confirmationFunction={() => {
                        setShowModal(false);
                    }}
                    heading={modalTexts[0]}
                    subHeading={modalTexts[1]}
                    confirmButtonText={t("ignore")}
                    regionalCustomization={{
                        downloadTheme: null,
                        correctTheme: {data: availablePlaceForCorrection, toPlaceInfo}
                    }}
                />
            )}
            <div className="top">
                {
                    hasInvalidItems ? (
                        <div className="stats-container-invalid">
                            <span className="incorrect-msg-container">
                                <span className="bold">{`${invalidCount} ${t("incorrect")}`}</span>
                                <span>{t("outOf")}</span>
                                <span className="bold">{getPlaceFrontOutput.data.length}</span>
                            </span>
                            <span>{t("postcode/city")}</span>
                        </div>) : (
                        <div className="stats-container-valid">
                            <span className="bold">{getPlaceFrontOutput.data.length}</span>
                            <span>{t("postcode/city")}</span>
                        </div>
                    )
                }
            </div>
            <ol>
                {
                    Array.isArray(getPlaceFrontOutput.data) && (
                        <VirtualList
                            height={500}
                            width={"100%"}
                            itemCount={getPlaceFrontOutput.data.length as number}
                            itemSize={90}
                        >
                            {
                                ({index, style}: { index: number, style: React.CSSProperties }) => {
                                    const {
                                        postcode,
                                        placeName,
                                        isValid,
                                        id,
                                    } = getPlaceFrontOutput.data?.[index] as Place;
                                    return (
                                        (
                                            <li style={style} key={index}>
                                                <span className="list-order">{index + 1}</span>
                                                <span className="box box1">{postcode}</span>
                                                <span className={`box box2 ${!isValid && "notValid"}`}>
                                                    {placeName}
                                                    {!isValid && <span className="error-msg">
                                                        {t("correctLocation")}
                                                    </span>}
                                                </span>
                                                {
                                                    !isValid && (
                                                        <div className="correct-container">
                                                            <MaterialButtonWrapper
                                                                onClick={() => {
                                                                    handleCorrect(postcode, id as symbol);
                                                                }}
                                                                label={t("correct")}
                                                                variant="outlined"
                                                                type={"button"}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </li>
                                        )
                                    )
                                }
                            }
                        </VirtualList>
                    )
                }
                {(!Array.isArray(placeList)) && <li>Error - no places found</li>}
            </ol>
        </div>
    );
};
export default PlaceInfo;