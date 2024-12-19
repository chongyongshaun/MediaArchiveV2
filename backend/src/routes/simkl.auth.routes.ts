import { Router } from "express";
import { generateAuthUrl, handleCallback } from "../controllers/simkl.auth.controller";

const router = Router();

router.get("/authorize", generateAuthUrl); // Redirect user to Simkl
router.get("/callback", handleCallback); // Handle Simkl redirect with code

export default router;
