import {useCallback, useEffect, useRef, useState} from "react";
import RegionClient from "../api/region/client";
import {RegionDivisionVO} from "../api/region/models";
import {RegionForm} from "../forms/addRegion/regionFormConfig";
import {useNavigate} from "react-router-dom";

export const useGetAllRegions = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [regions, setRegions] = useState<RegionDivisionVO[]>([]);
    const [divisionOptions, setDivisionOptions] = useState<string[]>([]);
    const [totalNumOfRegions, setTotalNumOfRegions] = useState<number>(0);

    const getAllRegions = useCallback((query: string) => {
        // setIsLoading(true);
        return RegionClient.getAllRegions(query)
            .then((data): void => setRegions(data.data.data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const getAllRegionsOptions = useCallback(() => {
        return RegionClient.getAllRegionsOptions()
            .then((data): void => {
                const divisionList: string[] = data.data.data.map((region: RegionDivisionVO) => region.regionDistribution);
                const res:string[] = Array.from(new Set(divisionList))
                setDivisionOptions(res);
                setTotalNumOfRegions(divisionList.length);
            })
            .catch(console.error)
            .finally(() => {setIsLoading(false)})
    }, []);

    return {getAllRegions, isLoading, regions, divisionOptions, getAllRegionsOptions, totalNumOfRegions};
};

export const useNewRegion = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const addNewRegion = (values: RegionForm, regionId: string | undefined) => {
        setIsLoading(true);
        return RegionClient.addNewRegion(values, regionId)
            .then(() => {
                navigate("/regions")
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }
    return {addNewRegion, isLoading};
};

export const useDeleteRegion = () => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteRegionById = (regionId: number) => {
        return RegionClient.deleteRegionById(regionId)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }

    return {deleteRegionById, isLoading};
};

export const useGetPlaces = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getPlaces = (searchTerm: string | undefined, regionId: string | undefined) => {
        return RegionClient.getPlaces(searchTerm, regionId)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }

    return {getPlaces, isLoading};
};

export const useGetRegionById = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getRegionById = (regionId: number) => {
        return RegionClient.getRegionById(regionId)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }

    return {getRegionById, isLoading};
};