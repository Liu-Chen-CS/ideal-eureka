import {EonUiButton} from "@eon-ui/eon-ui-components-react";
import {useTranslation} from "react-i18next";
import Modal from "react-modal";
import "./confirmBackModal.css";
import React, {useCallback} from "react";
import {Place} from "../../../forms/addRegion/regionFormConfig";

interface Props {
    heading: string;
    subHeading?: string;
    confirmButtonText: string;
    closeModal: () => void;
    confirmationFunction: (...args: any[]) => void;
    regionalCustomization?: {
        downloadTheme: { content: string | null, msg: string, switchOffModal: () => void } | null;
        correctTheme: { data: Place[] | null, toPlaceInfo: (placeName:string) => void } | null;
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

    const handleClose = () => {
        closeModal();
    };

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
                <div
                    className={`${regionalCustomization ? (regionalCustomization.downloadTheme ? ("confirm-modal-download-buttons") : ("confirm-modal-correct-buttons")) : ("confirm-modal-buttons")}`}>
                    {
                        regionalCustomization ? (
                            regionalCustomization.downloadTheme ? (
                                <div className="download-container">
                                    <span className="download-info">{regionalCustomization?.downloadTheme?.msg}</span>
                                    <EonUiButton
                                        text={t("download")}
                                        icon="download"
                                        iconPosition="left"
                                        rank="secondary"
                                        onButtonClick={() => regionalCustomization?.downloadTheme && downloadDuplicateFile(regionalCustomization?.downloadTheme.content)}
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
                                                            <EonUiButton
                                                                rank="secondary"
                                                                text={t("replace")}
                                                                className="confirm-modal-button"
                                                                onButtonClick={() => regionalCustomization.correctTheme?.toPlaceInfo(placeName)}
                                                            ></EonUiButton>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (<span>no matches found</span>)
                                        }
                                    </ul>
                                </div>)
                        ) : (<EonUiButton
                                rank="secondary"
                                text={t("cancel")}
                                className="confirm-modal-button"
                                onButtonClick={handleClose}
                            ></EonUiButton>
                        )
                    }
                    <EonUiButton
                        text={confirmButtonText}
                        onButtonClick={() => confirmationFunction()}
                    ></EonUiButton>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmModal;