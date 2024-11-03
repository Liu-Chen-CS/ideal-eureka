import "./addRegion.css";
import ConfirmModal from "../../components/customUiElements/confirmBackModal/confirmBackModal";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ArrowLeft from "../../assets/leftArrow.svg";
import {EonUiHeadline} from "@eon-ui/eon-ui-components-react";
import SPFRegion from "./singlePageForm/SPFRegion";
import {
  initialValuesRegionForm,
  RegionForm,
} from "../../forms/addRegion/regionFormConfig";
import {useGetAllRegions} from "../../hooks/hooks";
import LoadingSpinner from "../../components/customUiElements/LoadingSpinner/LoadingSpinner";

interface Props {
  mode: "create" | "edit" | "copy";
}

const AddRegion: React.FC<Props> = ({mode}) => {
  const {state} = useLocation();

  const {regionId} = useParams();

  const {t} = useTranslation();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);

  const getHeadline = useCallback(():string => {
    if(mode === "create" || mode === "copy"){
      return "addNewRegion";
    }else{
      return "editNewRegion";
    }
  }, []);

  const handleCloseModal = useCallback((): void => {
    setShowModal(false);
  }, []);

  const confirmBack = useCallback((): void => {
    setShowModal(true);
  }, []);

  const getInitialValuesRegionForm = (mode: "edit" | "create" | "copy"): RegionForm => {
    if (mode === "edit") {
      return ({...state, mode: "edit"});
    } else if (mode === "create") {
      return ({...initialValuesRegionForm, mode: "create"});
    } else if (mode === "copy") {
      return ({...state, mode: "copy"});
    } else {
      throw new Error("no such mode");
    }
  };

  const checkIsDuplicate = (obj1: any, obj2: any): boolean => {
    for (let key in obj1) {
      if (key === "mode") continue;
      else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        if (!checkIsDuplicate(obj1[key], obj2[key])) {
          return false;
        }
      } else {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCheckDuplicates = (userInput: RegionForm): boolean => {
    return checkIsDuplicate(state, userInput);
  }

  const {getAllRegionsOptions, divisionOptions, isLoading} = useGetAllRegions();

  useEffect((): void => {
    getAllRegionsOptions();
  }, []);

  return (
      <div className="add-region-container">
        {showModal && (
            <ConfirmModal
                closeModal={handleCloseModal}
                heading={t("confirmBack_header")}
                subHeading={t("confirmBack_sub")}
                confirmButtonText={t("goBack")}
                confirmationFunction={() => navigate("/regions")}
            />
        )}
        <div className="add-region-headline">
          <div className="add-region-headline-left">
            <img
                alt="backArrow"
                src={ArrowLeft}
                className="add-region-back-icon"
                onClick={(): void => {
                  setShowModal(true);
                }}
            />
            <EonUiHeadline text={t(getHeadline())} scheme="red500" size="h4"/>
          </div>
        </div>

        {isLoading ? (
            <div className="loading-icon-add-region"><LoadingSpinner/></div>
        ) : (
            <div className="add-bonus-form">
              <SPFRegion
                  confirmBack={confirmBack}
                  options={divisionOptions}
                  mode={mode}
                  handleInitialValues={getInitialValuesRegionForm}
                  regionId={regionId}
                  checkDuplicates={handleCheckDuplicates}
              />
            </div>
        )}
      </div>
  );
};

export default AddRegion;