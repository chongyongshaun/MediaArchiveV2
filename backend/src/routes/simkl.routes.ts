import { Router } from "express";
import { syncSimklData, syncAllSimklData, getFullSimklActivities, getUpdatedSimklData, getUpdatedRatingsData } from "../controllers/simkl.controller";

const router = Router();

router.get("/", syncSimklData);
router.get("/all", syncAllSimklData);
router.post("/activities", getFullSimklActivities);
router.get("/updated", getUpdatedSimklData);
router.get("/updated/ratings", getUpdatedRatingsData);


export default router;
