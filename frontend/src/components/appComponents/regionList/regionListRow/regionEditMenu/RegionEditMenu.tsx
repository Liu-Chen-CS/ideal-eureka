import "./regionEditMenu.css";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import ConfirmModal from "../../../../customUiElements/confirmBackModal/confirmBackModal";
import {useNavigate} from "react-router-dom";
import {useDeleteRegion, useGetRegionById} from "../../../../../hooks/hooks";

interface Props {
    regionId: number;
    productName: string;
    reloadTrigger: () => void;
    closeOptions: () => void;
}

const RegionEditMenu: React.FC<Props> = (
    {
        regionId,
        productName,
        reloadTrigger,
        closeOptions,
    }) => {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    const {t} = useTranslation();

    const editClassName = deleteModalOpen
        ? "region-edit-menu-container-inner edit-hidden"
        : "region-edit-menu-container-inner";

    const {deleteRegionById, isLoading} = useDeleteRegion();

    const handleDelete = (regionId: number) => {
        deleteRegionById(regionId).then(() => {
            reloadTrigger();
            closeOptions();
        });
    };

    const {getRegionById} = useGetRegionById();

    const handleEdit = (regionId: number) => {
        getRegionById(regionId).then((data) => {
            navigate(`/regions/edit/${regionId}`, {state: data?.data.data});
        });
    };

    const handleCopy = (regionId: number) => {
        getRegionById(regionId).then((data) => {
            navigate(`/regions/copy/${regionId}`, {state: data?.data.data});
        });
    };

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

    return (
        <div className="region-edit-menu-container">
            <div className={editClassName}>
                <div
                    className="edit-menu-option"
                    onClick={() => handleEdit(regionId)}
                >
                    {t("showEdit")}
                </div>
                <div
                    className="edit-menu-option"
                    onClick={() => {
                        handleCopy(regionId)
                    }}
                >
                    {t("copy")}
                </div>
                <div
                    className="edit-menu-option"
                    onClick={() => setDeleteModalOpen(true)}
                >
                    {t("delete")}
                </div>
            </div>
            {deleteModalOpen && (
                <ConfirmModal
                    closeModal={() => setDeleteModalOpen(false)}
                    heading={
                        t("confirmDeletion_sub_1") +
                        productName +
                        t("confirmDeletion_sub_2")
                    }
                    subHeading={
                        t("confirmDeletion_sub_1") +
                        productName +
                        t("confirmDeletion_sub_2")
                    }
                    confirmButtonText={t("delete")}
                    confirmationFunction={() => {
                        handleDelete(regionId)
                    }}
                />
            )}
        </div>
    );
};
export default RegionEditMenu;