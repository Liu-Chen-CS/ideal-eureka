import "./regionListRow.css";
import EditIcon from "../../../../assets/editIcon.svg";
import {useCallback, useMemo, useState} from "react";
import DownloadIcon from "../../../../assets/download.svg";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import ConfirmModal from "../../../customUiElements/confirmBackModal/confirmBackModal";
import {useDeleteRegion, useGetRegionById} from "../../../../hooks/hooks";
import MaterialUIDropdownMenuWrapper
    from "../../../customUiElements/materialUiWrapper/materialUiDropdownMenuWrapper/materialUiDropdownMenuWrapper";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface Props {
    regionId: number;
    regionDistribution: string;
    listName: string;
    customer: string;
    division: string,
    createdOn: string,
    restmenge?: string,
    version?: number,
    triggerReload: () => void,
}

const RegionListRow: React.FC<Props> = (
    {
        regionId,
        regionDistribution,
        listName,
        customer,
        division,
        createdOn,
        restmenge,
        version,
        triggerReload,
    }
) => {

    const [showOptions, setShowOptions] = useState(false);
    const {t} = useTranslation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const closeOptions = () => {
        setShowOptions(false);
    };

    const isDeutschlandweit: boolean = useMemo(() => {
        return regionDistribution.includes("Deutschlandweit");
    }, [regionDistribution]);

    const downloadCSV = useCallback(() => {
        const fileUrl = `${process.env.PUBLIC_URL}/deutschlandweit.csv`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "Deutschlandweit.csv";
        link.click();
    }, []);

    const {deleteRegionById, isLoading} = useDeleteRegion();

    const handleDelete = (regionId: number) => {
        deleteRegionById(regionId).then(() => {
            triggerReload();
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

    const editMenuItems = [
        {
            label: t("showEdit"),
            onClick: () => handleEdit(regionId),
        },
        {
            label: t("copy"),
            onClick: () => handleCopy(regionId),
        },
        {
            label: t("delete"),
            onClick: () => setDeleteModalOpen(true),
        },
    ];

    return (
        <tr className="region-list-row-container">
            <td className="region-list-row-item">{regionDistribution}</td>
            <td className="region-list-row-item">
                <ul>
                    <li>{regionDistribution}</li>
                    {
                        (!isDeutschlandweit) && <li className="bottom-li">{restmenge}</li>
                    }
                </ul>
            </td>
            <td className="region-list-row-item">{customer}</td>
            <td className="region-list-row-item">{division}</td>
            <td className="region-list-row-item">{createdOn}</td>
            {
                isDeutschlandweit ? (
                    <td className="download-container">
                        <FileDownloadOutlinedIcon
                            sx={{"&:hover": {cursor: "pointer",}}}
                            onClick={downloadCSV}
                        />
                    </td>) : (
                    <td
                        className="bonus-list-row-edit"
                    >
                        <MaterialUIDropdownMenuWrapper
                            menuItems={editMenuItems}
                            buttonImageSource={EditIcon}
                            buttonImageAlt="Edit Button"
                        />
                    </td>
                )
            }
            <td>
                {deleteModalOpen && (
                    <ConfirmModal
                        closeModal={() => setDeleteModalOpen(false)}
                        heading={
                            t("confirmDeletion_sub_1") +
                            regionDistribution +
                            t("confirmDeletion_sub_2")
                        }
                        subHeading={
                            t("confirmDeletion_sub_1") +
                            regionDistribution +
                            t("confirmDeletion_sub_2")
                        }
                        confirmButtonText={t("delete")}
                        confirmationFunction={() => {
                            handleDelete(regionId)
                        }}
                    />
                )}
            </td>
        </tr>
    );
};

export default RegionListRow;