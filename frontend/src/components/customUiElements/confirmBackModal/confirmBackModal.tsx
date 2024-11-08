import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import {useTranslation} from "react-i18next";
import Modal from "react-modal";
import "./confirmBackModal.css";
import React, {useCallback} from "react";
import {Place} from "../../../forms/addRegion/regionFormConfig";
import MaterialButtonWrapper from "../materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";

interface Props {
    heading: string;
    subHeading?: string;
    confirmButtonText: string;
    closeModal: () => void;
    confirmationFunction: (...args: any[]) => void;
    regionalCustomization?: {
        downloadTheme: { content: string | null, msg: string, switchOffModal: () => void } | null;
        correctTheme: { data: Place[] | null, toPlaceInfo: (placeName: string) => void } | null;
        demoNotice?: { data: string[] }
    }
}

const ConfirmModal: React.FC<Props> = ({
                                           closeModal,
                                           heading,
                                           subHeading,
                                           confirmButtonText,
                                           confirmationFunction,
                                           regionalCustomization
                                       }) => {
    const {t} = useTranslation();

    const customStyles = {
        content: {
            top: "40%",
            left: "52%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderBottom: "5px solid rgb(176, 4, 2)",
        },
    };

    const handleClose = (): void => closeModal();

    const downloadDuplicateFile = useCallback((duplicateFileContent: string | null) => {
        if (duplicateFileContent) {
            regionalCustomization?.downloadTheme?.switchOffModal();
            const blob = new Blob([duplicateFileContent], {type: "text/csv;charset=utf-8;"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "duplicate_places.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }, []);
    const getDownloadStyle = useCallback(() => {
        return {
            content: {
                ...customStyles.content,
                width: "500px",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }
        };
    }, []);
    const getCorrectStyle = useCallback(() => {
        return {
            content: {
                ...customStyles.content,
            }
        };
    }, []);

    return (
        <div className="confirm-back-modal-container">
            <Modal
                isOpen={true}
                onRequestClose={handleClose}
                style={regionalCustomization ? (regionalCustomization.downloadTheme ? (getDownloadStyle()) : (getCorrectStyle())) : (customStyles)}
                ariaHideApp={false}
                overlayClassName="modal-overlay"
            >
                <p className="confirm-modal-heading">{heading}</p>
                <p className="confirm-modal-sub-heading">{subHeading}</p>
                {regionalCustomization?.demoNotice && (
                    <div>
                        <p className="confirm-modal-heading">{regionalCustomization?.demoNotice.data[0]}</p>
                        <p>{regionalCustomization?.demoNotice.data[1]}</p>
                    </div>
                )}
                <div
                    className={`${regionalCustomization ? (regionalCustomization.downloadTheme ? ("confirm-modal-download-buttons") : ("confirm-modal-correct-buttons")) : ("confirm-modal-buttons")}`}>
                    {
                        regionalCustomization ? (
                            regionalCustomization.downloadTheme ? (
                                <div className="download-container">
                                    <span className="download-info">{regionalCustomization?.downloadTheme?.msg}</span>
                                    <MaterialButtonWrapper
                                        label={t("download")}
                                        variant="outlined"
                                        onClick={() => regionalCustomization?.downloadTheme && downloadDuplicateFile(regionalCustomization?.downloadTheme.content)}
                                        type={"button"}
                                    />
                                </div>
                            ) : (
                                <div className="correct-container">
                                    <ul>
                                        {
                                            regionalCustomization.correctTheme?.data ? (
                                                regionalCustomization.correctTheme.data.map(({
                                                                                                 placeName,
                                                                                                 postcode
                                                                                             }, index: number) => (
                                                    <li key={index}>
                                                        <span className="box box1">{postcode}</span>
                                                        <span className="box box2">{placeName}</span>
                                                        <div>
                                                            <MaterialButtonWrapper
                                                                label={t("replace")}
                                                                onClick={() => regionalCustomization.correctTheme?.toPlaceInfo(placeName)}
                                                                variant="outlined"
                                                                size={"large"}
                                                                type={"button"}
                                                                startIcon={<PublishedWithChangesOutlinedIcon/>}
                                                            />
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (<span>no matches found</span>)
                                        }
                                    </ul>
                                </div>)
                        ) : (<MaterialButtonWrapper
                                label={t("cancel")}
                                variant="outlined"
                                onClick={handleClose}
                                size={"medium"}
                                type={"button"}
                            />
                        )
                    }
                    <MaterialButtonWrapper
                        label={confirmButtonText}
                        onClick={confirmationFunction}
                        variant="contained"
                        size={"medium"}
                        type={"button"}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmModal;