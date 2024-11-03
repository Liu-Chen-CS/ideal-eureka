import express from "express";
import RegionController from "../controllers/region.controller";

const router = express.Router();

router.post("/new", RegionController.newRegion);
router.post(`/update/:regionId`, RegionController.updateRegion);

router.get("/regions", RegionController.getAllRegions);
router.get(`/:regionId`, RegionController.getRegionById);

router.delete("/delete/:regionId", RegionController.deleteRegionById);

export default router;
