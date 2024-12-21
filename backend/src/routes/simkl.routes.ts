import { Router } from "express";
import { syncSimklData, syncAllSimklData, updateHandler } from "../controllers/simkl.controller";

const router = Router();

router.get("/", syncSimklData);
//return all simkl data (first sync calls simkl api directly, after that get from db)
router.get("/all", syncAllSimklData);
//if there's a change in activities (for all, ratings, removals) returns the updated data, else returns empty res
router.get("/activities", updateHandler);


export default router;
