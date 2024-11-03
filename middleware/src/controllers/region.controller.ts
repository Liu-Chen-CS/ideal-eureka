import {Request, Response} from "express";
import {prisma} from "../server";
import dayjs from "dayjs";
import {RegionDivisionVO} from "frontend/src/api/region/models";
import {List, Place} from "frontend/src/forms/addRegion/regionFormConfig";

interface QueryParams {
    customer?: string[];
    division?: string[];
    distribution?: string[];
    searchTerm?: string[];
}

export class RegionController {

    public async newRegion(req: Request, res: Response): Promise<void> {
        console.log("newRegion")
        try {
            const {list, regionDivisionConfig: {regionDivisionOption, version, branch, client}, restmenge} = req.body;

            await prisma.$transaction(async (prisma) => {
                const regionDivision = await prisma.region_division.create({
                    data: {
                        region_division: regionDivisionOption,
                        branch,
                        client,
                        version: parseInt(version),
                        createdOn: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        restmenge: {
                            create: {restmenge},
                        },
                    },
                });
                const regionDivisionId: number = regionDivision.region_division_id;

                for (const listItem of list) {
                    const createdList = await prisma.list.create({
                        data: {
                            list_name: listItem.listInfo.listName,
                            list_details: listItem.listInfo.listDetails,
                            region_division_id: regionDivisionId,
                        },
                    });
                    const listId: number = createdList.list_id;
                    const placeData = listItem.placeList.map((placeItem: Place) => ({
                        place_name: placeItem.placeName,
                        postcode: placeItem.postcode,
                        list_id: listId,
                    }));
                    const BATCH_SIZE = 500;
                    for (let i: number = 0; i < placeData.length; i += BATCH_SIZE) {
                        const batch = placeData.slice(i, i + BATCH_SIZE);
                        await prisma.place.createMany({data: batch});
                    }
                }
                res.status(200).json({
                    message: "Region division created successfully",
                    data: regionDivision,
                });
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "An error occurred while creating the region division"});
        }
    }

    public async getAllRegions(req: Request, res: Response): Promise<void> {
        try {
            const queryParams: QueryParams = req.query;
            const filters: any = {};
            if (queryParams.customer && queryParams.customer.length > 0) {
                filters.client = {in: queryParams.customer};
            }
            if (queryParams.division && queryParams.division.length > 0) {
                filters.branch = {in: queryParams.division};
            }
            if (queryParams.distribution && queryParams.distribution.length > 0) {
                filters.region_division = {in: queryParams.distribution};
            }
            if (queryParams.searchTerm && queryParams.searchTerm.length > 0 && queryParams.searchTerm[0].length !== 0) {
                const searchTerm: string = queryParams.searchTerm[0];
                filters.OR = [
                    {region_division: {contains: searchTerm}},
                    {client: {contains: searchTerm}},
                    {branch: {contains: searchTerm}},
                    {createdOn: {contains: searchTerm}},
                    {restmenge: {restmenge: {contains: searchTerm}}}
                ];
            }

            const rawDB = await prisma.region_division.findMany({
                where: filters,
                include: {
                    restmenge: true,
                    list: {
                        include: {
                            place: true,
                        }
                    }
                }
            });

            const result: RegionDivisionVO[] = rawDB.reduce((a: any, c) => {
                const temp: RegionDivisionVO = {
                    regionId: c.region_division_id,
                    regionDistribution: c.region_division || "not found",
                    customer: c.client || "not found",
                    // listName: c.list_hinzufuge?.list_name || "not found",
                    listName: `${c.region_division}_${c.version}` || "not found",
                    division: c.branch || "not found",
                    createdOn: c.createdOn || "not found",
                    restmenge: c.restmenge?.restmenge || "not found",
                    version: c.version || 0,
                }
                a.push(temp);
                return a;
            }, [])
            const response = {data: result,}
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    public async getRegionById(req: Request, res: Response) {
        console.log("getRegionById")
        const regionId = parseInt(req.params.regionId);
        console.log(regionId)
        if (isNaN(regionId)) {
            res.status(400).json({error: "Invalid regionId"});
            return;
        }
        try {
            const result = await prisma.region_division.findUnique({
                where: {
                    region_division_id: regionId,
                },
                include: {
                    restmenge: true,
                    list: {
                        include: {
                            place: true,
                        }
                    }
                }
            });
            if (result) {
                console.log(result);
                const RegionViewVo = {
                    mode: "",
                    regionDivisionConfig: {
                        newRegionDivision: result.region_division as string,
                        regionDivisionOption: result.region_division as string,
                        version: "" + result.version,
                        branch: result.branch as "" | "Strom" | "Gas" | undefined,
                        client: result.client as "Privat" | "Gewerbe" | "",
                    },
                    restmenge: result.restmenge?.restmenge as string,
                    list: result.list.reduce((a: List[], c) => {
                        const temp = {
                            id: c.list_id,
                            listInfo: {
                                listName: c.list_name as string,
                                listDetails: c.list_details as string,
                            },
                            placeList: c.place.reduce((a: Place[], c) => {
                                const temp = {
                                    placeName: c.place_name as string,
                                    postcode: c.postcode as string,
                                }
                                a.push(temp);
                                return a;
                            }, [])
                        }
                        a.push(temp);
                        return a;
                    }, [])
                };
                const response = {data: RegionViewVo}
                res.status(200).json(response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async deleteRegionById(req: Request, res: Response): Promise<void> {
        console.log("deleteRegionById")
        const regionId: number = parseInt(req.params.regionId);
        if (isNaN(regionId)) {
            res.status(400).json({error: "Invalid regionId"});
            return;
        }
        try {
            const result = await prisma.region_division.delete({
                where: {
                    region_division_id: regionId,
                },
            });
            res.status(200).json({message: "Region deleted successfully", result});
        } catch (error) {
            console.error(error);
        }
    }

    public async updateRegion(req: Request, res: Response): Promise<void> {
        try {
            const {regionId} = req.params;
            const {
                regionDivisionConfig,
                restmenge,
                list,
            } = req.body;

            const existingRegion = await prisma.region_division.findUnique({
                where: {region_division_id: Number(regionId)},
                include: {
                    restmenge: true,
                    list: {
                        include: {
                            place: false,
                        }
                    }
                }
            });

            console.log("existingRegion", existingRegion);

            if (!existingRegion) {
                res.status(404).json({message: "Region not found"});
                return;
            }

            const updatedRegion = await prisma.region_division.update({
                where: {region_division_id: Number(regionId)},
                data: {
                    region_division: `${regionDivisionConfig.regionDivisionOption}`,
                    branch: regionDivisionConfig.branch || existingRegion.branch,
                    version: regionDivisionConfig.version ? Number(regionDivisionConfig.version) : existingRegion.version,
                    client: regionDivisionConfig.client || existingRegion.client,
                    createdOn: dayjs().format("YYYY-MM-DD HH:mm:ss"),

                    restmenge: {
                        update: {
                            where: {restmenge_id: existingRegion.restmenge?.restmenge_id},
                            data: {
                                restmenge: restmenge || existingRegion.restmenge?.restmenge
                            }
                        }
                    },
                    list: {
                        update: list.map((item: List) => ({
                            where: {list_id: item.id},
                            data:{
                                list_name: item.listInfo.listName,
                                list_details: item.listInfo.listDetails,
                            }
                        }))
                    }
                },
                include: {
                    restmenge: true,
                    list: {
                        include: {
                            place: false,
                        }
                    }
                }
            });

            res.status(200).json(updatedRegion);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Failed to update region", error});
        }
    }

}

export default new RegionController();
