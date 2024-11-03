import {client} from "../common/client";
import {RegionForm} from "../../forms/addRegion/regionFormConfig";
import {RegionAPIReponse} from "./models";

export default class RegionClient {

    private static readonly BASEPATH = "/api/v1/region";

    public static getAllRegions = async (query: string): Promise<RegionAPIReponse> => {
        const res = await client.get<RegionAPIReponse>(
            `${this.BASEPATH}/regions?${query}`
        );
        return {data: res.data};
    };

    public static getRegionById = async (regionId: number): Promise<RegionAPIReponse> => {
        const res = await client.get<RegionAPIReponse>(
            `${this.BASEPATH}/${regionId}`
        );
        return {data: res.data};
    };

    public static getAllRegionsOptions = async (): Promise<RegionAPIReponse> => {
        const res = await client.get<RegionAPIReponse>(
            `${this.BASEPATH}/regions?`
        );
        return {data: res.data};
    };

    public static addNewRegion = async (values: RegionForm, regionId: string | undefined): Promise<RegionAPIReponse> => {
        let res: RegionAPIReponse;
        if(regionId === undefined) {
            res = await client.post<RegionAPIReponse>(
                `${this.BASEPATH}/new`, values
            );
        }
        else{
            res = await client.post<RegionAPIReponse>(
                `${this.BASEPATH}/update/${regionId}`, values
            );
        }
        return {data: res.data};
    };

    public static deleteRegionById = async (regionId: number): Promise<RegionAPIReponse> => {
        const res = await client.delete<RegionAPIReponse>(
            `${this.BASEPATH}/delete/${regionId}`
        );
        return {data: res.data};
    };

    public static getPlaces = async (searchTerm:string | undefined, regionId: string | undefined): Promise<RegionAPIReponse> => {
        let res: RegionAPIReponse;

        if ((searchTerm === undefined || searchTerm.length === 0)) {
            res = await client.get(`${this.BASEPATH}/places/${regionId}`);
        }
        else{
            res = await client.get(`${this.BASEPATH}/places/${regionId}/${searchTerm}`);
        }
        return {data: res.data};
    };

};