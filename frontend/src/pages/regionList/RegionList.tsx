import "./regionList.css";
import PlusIcon from "../../assets/plus.svg";
import HoverButton from "../../components/customUiElements/hoverButton/hoverButton";
import RegionSorting from "../../components/appComponents/regionList/sorting/regionSorting";
import {useCallback, useEffect, useMemo, useState} from "react";
import RegionListRow from "../../components/appComponents/regionList/regionListRow/RegionListRow";
import {useGetAllRegions} from "../../hooks/hooks";
import qs from "qs";
import {RegionSoringOptions} from "../../types/types";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import LoadingSpinner from "../../components/customUiElements/LoadingSpinner/LoadingSpinner";
import {RegionDivisionVO} from "../../api/region/models";
import {Button, IconButton, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import MaterialButtonWrapper
    from "../../components/customUiElements/materialUiWrapper/materialButtonWrapper/MaterialButtonWrapper";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SaveIcon from "@mui/icons-material/Save";

const RegionList: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [currentTimer, setCurrentTimer] = useState<NodeJS.Timeout>();
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [showDeutschlandweit, setShowDeutschlandweit] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<"regionDistribution" | "listName" | "customer" | "createdOn" | "division">("createdOn");
    const [sortingAlgo, setSortingAlgo] = useState<"az" | "za">("az");
    const [selectedSortingOptions, setSelectedSortingOptions] = useState<RegionSoringOptions>({
        customer: [],
        division: [],
        distribution: [],
        searchTerm: [],
    });

    const resetSorting = useCallback(() => {
        setSelectedSortingOptions({
            customer: [],
            division: [],
            distribution: [],
            searchTerm: [],
        })
    }, []);

    const handleAddRegionClick = useCallback((): void => {
        navigate("/regions/new");
    }, []);

    const handleSortingOptionsChange = useCallback((key: string, value: string): void => {
        if (key === "searchTerm") {
            setSelectedSortingOptions((prev) => ({
                ...prev,
                [key]: [value],
            }));
        } else {
            setSelectedSortingOptions((prev) => (
                {
                    ...prev,
                    [key]: (prev[key] === undefined || prev[key].length === 0)
                        ? [value]
                        : prev[key].includes(value)
                            ? prev[key].filter((v: string): boolean => v != value)
                            : [...prev[key], value]
                }
            ));
        }
    }, [selectedSortingOptions]);

    const triggerReload = useCallback(() => {
        setReloadTrigger(reloadTrigger + 1);
    }, [reloadTrigger]);

    const {
        getAllRegions,
        isLoading,
        regions,
        divisionOptions,
        getAllRegionsOptions,
        totalNumOfRegions
    } = useGetAllRegions();

    const {customers, division, distribution} = useMemo(() => {
        const customers: string[] = ["Privat", "Gewerbe",];
        const division: string[] = ["Strom", "Gas",];
        const distribution: string[] = Array.isArray(divisionOptions) ? divisionOptions : [];
        return {customers, division, distribution};
    }, [divisionOptions]);


    let sortedRegions: RegionDivisionVO[] = [];

    const mappedRegionRows = useMemo(() => {
        if (regions.length < 1) return null;
        sortedRegions = [...regions].sort((a, b) => {
            const valueA: string = a[sortBy];
            const valueB: string = b[sortBy];
            if (sortBy === "createdOn") {
                const dateA: Date = new Date(valueA);
                const dateB: Date = new Date(valueB);
                return sortingAlgo === "az" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
            } else {
                return sortingAlgo === "az" ? valueA.localeCompare(valueB, "en", {sensitivity: "base"}) : valueB.localeCompare(valueA, "en", {sensitivity: "base"});
            }
        })
        return sortedRegions.map((region) => (
            <RegionListRow
                key={region.regionId}
                regionId={region.regionId}
                regionDistribution={region.regionDistribution}
                listName={region.listName}
                customer={region.customer}
                division={region.division}
                createdOn={region.createdOn}
                restmenge={region.restmenge}
                version={region.version}
                triggerReload={triggerReload}
            />
        ));
    }, [regions, sortBy, sortingAlgo]);


    const checkArraySortOrder = useCallback(<T extends Record<string, any>>(array: T[], key: keyof T): "az" | "za" => {
        let isAscending = true;
        let isDescending = true;
        const currentValue = key === "createdOn"
            ? new Date(array[0][key]).getTime()
            : String(array[0][key].trim()).toLowerCase();

        const nextValue = key === "createdOn"
            ? new Date(array[1][key]).getTime()
            : String(array[1][key].trim()).toLowerCase();
        if (currentValue > nextValue) isAscending = false;
        if (currentValue < nextValue) isDescending = false;
        if (!isAscending && !isDescending) {
            throw new Error("Array is unsorted");
        }
        return isAscending ? "az" : "za";
    }, []);

    const handleSortBy = useCallback((newSortOption: typeof sortBy) => {
        if (regions.length > 0) {
            const currentSortOrder: "az" | "za" = checkArraySortOrder(sortedRegions, newSortOption);
            if (currentSortOrder === "az") {
                setSortingAlgo("za");
            } else if (currentSortOrder === "za") {
                // console.log("123")
                setSortingAlgo("az");
            }
            setSortBy(newSortOption);
        }
    }, [sortBy, sortingAlgo, regions]);

    const areAllArraysEmpty = useCallback((data: RegionSoringOptions): boolean => {
        return Object.keys(data).every((key: string) => {
            if (key === "searchTerm") {
                const value = data[key as keyof RegionSoringOptions];
                if (Array.isArray(value) && value[0] === "") {
                    return true;
                }
                return Array.isArray(value) && value.length === 0;
            } else {
                const value = data[key as keyof RegionSoringOptions];
                return Array.isArray(value) && value.length === 0;
            }
        })
    }, []);

    useEffect((): void => {
        getAllRegionsOptions();
    }, [reloadTrigger]);

    useEffect(() => {
        if (currentTimer) {
            clearTimeout(currentTimer);
        }
        const timer = setTimeout(async () => {
            const query: string = qs.stringify(selectedSortingOptions);
            getAllRegions(query);
        }, 300);
        setCurrentTimer(timer);
        const areAllEmpty: boolean = areAllArraysEmpty(selectedSortingOptions);
        areAllEmpty ? setShowDeutschlandweit(true) : setShowDeutschlandweit(false);
        return (): void => clearTimeout(currentTimer);
    }, [selectedSortingOptions, reloadTrigger]);

    return (
        <div className="region-list-container">
            <HoverButton
                iconPath={PlusIcon}
                label="addNewRegion"
                deWidth={380}
                enWidth={240}
                onClick={handleAddRegionClick}
            />
            <div className="region-list-inner">
                <RegionSorting
                    customer={customers}
                    division={division}
                    distribution={distribution}
                    handleSortingOptionsChange={handleSortingOptionsChange}
                    resetSorting={resetSorting}
                />
                <div className="region-list-list">
                    <TextField
                        label={t("search")}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><SearchOutlinedIcon/></InputAdornment>,
                        }}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                fontSize: "18px",
                                height: "48px",
                                fontFamily: "EONBrixSans, Arial, Geneva, Helvetica, sans-serif",
                                borderRadius: "8px",
                                background: "#ffffff",
                                color: "#262626",
                                cursor: "default",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#cccbca",
                                    borderWidth: "3px",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1ea2b1",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1ea2b1",
                                },
                                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#b00402",
                                },
                            },
                            "& .MuiOutlinedInput-input.Mui-disabled": {
                                cursor: "not-allowed",
                            },
                        }}
                    />
                    {
                        (selectedSortingOptions.searchTerm[0] !== undefined && selectedSortingOptions.searchTerm[0].length !== 0) && (
                            <div className={`search-suggestion-container`}>
                                <div
                                    className="top-msg">{`${regions.length} Suchergebnis für '${selectedSortingOptions.searchTerm[0]}'`}</div>
                                <div className="bottom-container">
                                    <span>{`Showing ${regions.length} of ${totalNumOfRegions} Results`}</span></div>
                            </div>
                        )
                    }
                    <table className="region-list-table">
                        <tbody>
                        <tr>
                            <th className="table-header-large" onClick={() => handleSortBy("regionDistribution")}>
                                {t("regionDistribution")}
                            </th>
                            <th className="table-header-medium" onClick={() => handleSortBy("listName")}>
                                {t("listName")}
                            </th>
                            <th className="table-header-medium" onClick={() => handleSortBy("customer")}>
                                {t("customer")}
                            </th>
                            <th className="table-header-small" onClick={() => handleSortBy("division")}>
                                {t("division")}
                            </th>
                            <th className="table-header-small" onClick={() => handleSortBy("createdOn")}>
                                {t("createdOn")}
                            </th>
                        </tr>
                        {
                            isLoading ? (
                                <tr className="loading-icon-region-list">
                                    <td><LoadingSpinner/></td>
                                </tr>
                            ) : (
                                <>
                                    {showDeutschlandweit && (
                                        <RegionListRow
                                            regionId={regions.length + 1}
                                            regionDistribution="Deutschlandweit"
                                            listName="Deutschlandweit"
                                            customer="-"
                                            division="-"
                                            createdOn="-"
                                            triggerReload={triggerReload}
                                        />
                                    )}
                                    {mappedRegionRows}
                                </>
                            )
                        }
                        </tbody>
                    </table>
                    {
                        mappedRegionRows != undefined && mappedRegionRows.length === 0 && (
                            <div className="no-data-found">{t("noDataFound")}</div>
                        )
                    }
                    <MaterialButtonWrapper
                        variant="contained"
                        label={t("addNewRegion")}
                        onClick={(): void => navigate("/regions/new")}
                    />
                </div>
            </div>
        </div>
    );
};
export default RegionList;