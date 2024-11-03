import "./searchPlace.css";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import MaterialInputAdornmentWrapper from "../../../../../customUiElements/materialUiWrapper/materialInputAdornmentWrapper/MaterialInputAdornmentWrapper";

interface Props {
    regionId: string | undefined;
    helper: (places: { place_id: number, place_name: string, postcode: string }[]) => void;
    handleSearchTerm?: (searchTerm:string)=>void;
}

const SearchPlace: React.FC<Props> = ({regionId, helper, handleSearchTerm}) => {

    const {t} = useTranslation();

    const [searchTermFront, setSearchTermFront] = useState<string>("");

    useEffect(() => {
        if(handleSearchTerm){
            handleSearchTerm(searchTermFront);
        }
    }, [searchTermFront]);

    return (
        <div className="search-place-container">
            {
                handleSearchTerm ? (
                    <input
                        placeholder={`${t("searchByCode/place")}`}
                        type="text"
                        value={searchTermFront}
                        onChange={(value) => {
                            setSearchTermFront(value.target.value)
                        }}
                    ></input>
                ) : (
                    <MaterialInputAdornmentWrapper
                        name="listHinzufugen.searchTerm"
                        type="text"
                        label={t("searchByCode/place")}
                    />
                )
            }
        </div>
    );
};
export default SearchPlace;

