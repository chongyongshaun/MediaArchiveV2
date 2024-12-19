import { Router } from "express";
import { syncSimklData, syncAllSimklData, getFullSimklActivities } from "../controllers/simkl.controller";

const router = Router();

router.get("/", syncSimklData);
router.get("/all", syncAllSimklData);
router.get("/activities", getFullSimklActivities);

export default router;
